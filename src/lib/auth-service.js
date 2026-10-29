import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  linkWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase-config.js';
import { normalizeNZPhoneNumber } from './phone-utils.js';

/**
 * Standardized generic error mapper to prevent user enumeration
 * and provide user-friendly feedback.
 */
export function formatAuthError(error) {
  if (!error) return 'An unexpected authentication error occurred.';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-email':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Incorrect email or password. Please try again.';

    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in or use password recovery.';

    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';

    case 'auth/invalid-verification-code':
      return 'The SMS verification code entered is incorrect. Please check the code on your phone and try again.';

    case 'auth/code-expired':
      return 'The SMS verification code has expired. Please request a new code.';

    case 'auth/too-many-requests':
      return 'Too many attempts. Access has been temporarily blocked for security. Please try again in a few minutes.';

    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in window was closed before completion.';

    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by your browser. Please allow popups for this site.';

    case 'auth/credential-already-in-use':
      return 'This account is already linked to another customer profile.';

    case 'auth/quota-exceeded':
      return 'SMS service quota exceeded. Please try again later or contact the salon.';

    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in your Firebase project yet. Please enable it in the Firebase Console under Authentication > Sign-in method.';

    case 'auth/unauthorized-domain':
      return 'This website domain is not authorized in Firebase. Please add this domain under Firebase Console > Authentication > Settings > Authorized domains.';

    case 'auth/invalid-phone-number':
      return 'Invalid mobile number format. Please enter a valid New Zealand mobile number.';

    case 'auth/missing-phone-number':
      return 'Please enter your mobile phone number.';

    case 'auth/captcha-check-failed':
      return 'Security check verification failed. Please try again.';

    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

/**
 * Zarah Universal Customer Authentication Service
 */
export class ZarahAuthService {
  constructor() {
    this.recaptchaVerifier = null;
    this.activeConfirmationResult = null;
    this.authStateListeners = new Set();

    if (typeof window !== 'undefined' && auth) {
      onAuthStateChanged(auth, (firebaseUser) => {
        this.notifyListeners(firebaseUser);
      });
    }
  }

  isConfigured() {
    return isFirebaseConfigured() && auth !== null;
  }

  getUnconfiguredMessage() {
    return (
      'Production authentication requires your Firebase project keys.\n\n' +
      'Please add your PUBLIC_FIREBASE_API_KEY and credentials to .env to enable ' +
      'live Google OAuth, Sign in with Apple, real telecom SMS, and secure accounts.'
    );
  }

  /**
   * Subscribe to live authentication state changes
   */
  onAuthStateChange(callback) {
    this.authStateListeners.add(callback);
    if (auth && auth.currentUser) {
      callback(auth.currentUser);
    }
    return () => this.authStateListeners.delete(callback);
  }

  notifyListeners(user) {
    this.authStateListeners.forEach((fn) => {
      try {
        fn(user);
      } catch (e) {
        console.error('[ZarahAuth] Listener error:', e);
      }
    });
  }

  getCurrentUser() {
    return auth ? auth.currentUser : null;
  }

  /**
   * Sign In with Google OAuth 2.0
   */
  async signInWithGoogle() {
    if (!this.isConfigured()) {
      throw new Error(this.getUnconfiguredMessage());
    }

    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return null; // Clean cancellation
      }
      throw new Error(formatAuthError(error));
    }
  }

  /**
   * Sign In with Apple
   */
  async signInWithApple() {
    if (!this.isConfigured()) {
      throw new Error(this.getUnconfiguredMessage());
    }

    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');

    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return null; // Clean cancellation
      }
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error(
          'Sign in with Apple is currently being configured with the salon Apple Developer Account.\n\n' +
          'Please continue using Google, NZ Mobile SMS, or Email sign-in in the meantime.'
        );
      }
      throw new Error(formatAuthError(error));
    }
  }

  /**
   * Safely reset the reCAPTCHA verifier and DOM container
   * to prevent "reCAPTCHA has already been rendered in this element" errors.
   */
  resetRecaptcha(containerId = 'recaptcha-container') {
    if (this.recaptchaVerifier) {
      try {
        if (typeof this.recaptchaVerifier.clear === 'function') {
          this.recaptchaVerifier.clear();
        }
      } catch (e) {}
      this.recaptchaVerifier = null;
    }
    this.recaptchaWidgetId = null;

    if (typeof document !== 'undefined') {
      const oldEl = document.getElementById(containerId);
      if (oldEl && oldEl.parentNode) {
        const newEl = document.createElement('div');
        newEl.id = containerId;
        oldEl.parentNode.replaceChild(newEl, oldEl);
      }
    }
  }

  /**
   * Initialize or retrieve reCAPTCHA verifier for Phone SMS Auth
   */
  async getRecaptchaVerifier(containerId = 'recaptcha-container') {
    if (typeof window === 'undefined' || !auth) return null;

    // If an active verifier exists, reuse it
    if (this.recaptchaVerifier) {
      return this.recaptchaVerifier;
    }

    // Ensure the container is clean
    if (typeof document !== 'undefined') {
      const el = document.getElementById(containerId);
      if (el && el.hasChildNodes()) {
        const newEl = document.createElement('div');
        newEl.id = containerId;
        if (el.parentNode) el.parentNode.replaceChild(newEl, el);
      }
    }

    this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        console.warn('[ZarahAuth] reCAPTCHA expired. Resetting.');
        this.resetRecaptcha(containerId);
      },
    });

    try {
      this.recaptchaWidgetId = await this.recaptchaVerifier.render();
    } catch (renderErr) {
      console.warn('[ZarahAuth] reCAPTCHA render error, replacing container:', renderErr);
      this.resetRecaptcha(containerId);
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
      });
      this.recaptchaWidgetId = await this.recaptchaVerifier.render();
    }

    return this.recaptchaVerifier;
  }

  /**
   * Send Real SMS Verification Code to an E.164 phone number
   */
  async sendPhoneVerificationSMS(rawPhoneNumber, containerId = 'recaptcha-container') {
    if (!this.isConfigured()) {
      throw new Error(this.getUnconfiguredMessage());
    }

    // 1. Strict E.164 normalization (e.g. 021 123 4567 -> +64211234567)
    const e164Number = normalizeNZPhoneNumber(rawPhoneNumber);

    // 2. Invisible reCAPTCHA verification
    const appVerifier = await this.getRecaptchaVerifier(containerId);

    try {
      this.activeConfirmationResult = await signInWithPhoneNumber(auth, e164Number, appVerifier);
      return {
        success: true,
        normalizedNumber: e164Number,
      };
    } catch (error) {
      // Safely reset reCAPTCHA container so subsequent attempts never throw "already rendered"
      this.resetRecaptcha(containerId);

      if (error.code === 'auth/operation-not-allowed') {
        throw new Error(
          'Phone SMS authentication is not enabled in your Firebase project yet.\n\n' +
          'To enable it:\n' +
          '1. Go to Firebase Console -> Build -> Authentication -> Sign-in method\n' +
          '2. Click "Phone", toggle "Enable", and click "Save".'
        );
      }

      if (error.code === 'auth/unauthorized-domain') {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'your-domain';
        throw new Error(
          `Domain "${host}" is not authorized in your Firebase project.\n\n` +
          'To enable it:\n' +
          'In Firebase Console -> Authentication -> Settings -> Authorized domains, click "Add domain" and enter: ' + host
        );
      }

      throw new Error(formatAuthError(error));
    }
  }

  /**
   * Confirm Phone SMS Verification Code
   */
  async confirmPhoneCode(sixDigitCode) {
    if (!this.activeConfirmationResult) {
      throw new Error('No active SMS verification session. Please request a new code.');
    }

    const cleanCode = String(sixDigitCode || '').trim();
    if (!/^\d{6}$/.test(cleanCode)) {
      throw new Error('Please enter the 6-digit verification code sent to your phone.');
    }

    try {
      const result = await this.activeConfirmationResult.confirm(cleanCode);
      this.activeConfirmationResult = null;
      return result.user;
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }

  /**
   * Email & Password Sign In
   */
  async signInWithEmail(email, password) {
    if (!this.isConfigured()) {
      throw new Error(this.getUnconfiguredMessage());
    }

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error('Please enter both email and password.');
    }

    try {
      const result = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      return result.user;
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }

  /**
   * Email & Password Account Registration
   */
  async registerWithEmail(email, password, displayName, phone) {
    if (!this.isConfigured()) {
      throw new Error(this.getUnconfiguredMessage());
    }

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();
    const cleanName = String(displayName || '').trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error('Please provide an email address and password.');
    }

    if (cleanPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      if (cleanName) {
        await updateProfile(result.user, { displayName: cleanName });
      }
      return result.user;
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }

  /**
   * Password Reset Email
   */
  async sendPasswordReset(email) {
    if (!this.isConfigured()) {
      throw new Error(this.getUnconfiguredMessage());
    }

    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Please enter your email address.');
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return true;
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }

  /**
   * Sign Out Customer
   */
  async signOut() {
    if (auth && auth.currentUser) {
      await signOut(auth);
    }
    this.activeConfirmationResult = null;
    return true;
  }

  /**
   * Link an additional provider (Google, Apple) to current account
   */
  async linkProvider(providerType) {
    if (!auth || !auth.currentUser) {
      throw new Error('You must be signed in to link an account.');
    }

    let provider;
    if (providerType === 'google') {
      provider = new GoogleAuthProvider();
    } else if (providerType === 'apple') {
      provider = new OAuthProvider('apple.com');
    } else {
      throw new Error('Unsupported provider for linking.');
    }

    try {
      const result = await linkWithPopup(auth.currentUser, provider);
      return result.user;
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }
}

export const zarahAuth = new ZarahAuthService();
