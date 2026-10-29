import { zarahAuth } from '../lib/auth-service.js';
import { normalizeNZPhoneNumber, formatPhoneDisplay } from '../lib/phone-utils.js';

if (typeof window !== 'undefined') {
  window.ZarahAuth = zarahAuth;
  window.ZarahPhoneUtils = {
    normalizeNZPhoneNumber,
    formatPhoneDisplay,
  };

  // Listen to genuine Firebase Auth state changes
  zarahAuth.onAuthStateChange((firebaseUser) => {
    if (firebaseUser) {
      if (window.SalonStore && typeof window.SalonStore.syncAuthenticatedCustomer === 'function') {
        const customer = window.SalonStore.syncAuthenticatedCustomer(firebaseUser);
        window.dispatchEvent(new CustomEvent('zarah:auth-changed', { detail: customer }));
      }
    } else {
      // Clear customer session when signed out
      const current = window.SalonStore ? window.SalonStore.getCurrentCustomer() : null;
      if (current && current.authUid) {
        try {
          localStorage.removeItem('zarah_current_customer');
          window.dispatchEvent(new CustomEvent('zarah:auth-changed', { detail: null }));
        } catch (e) {}
      }
    }
  });
}

export { zarahAuth };
