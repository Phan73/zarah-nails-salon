import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeNZPhoneNumber, formatPhoneDisplay } from '../src/lib/phone-utils.js';
import { formatAuthError } from '../src/lib/auth-service.js';

test('NZ Phone Number Normalization to E.164', async (t) => {
  await t.test('normalizes standard 021 local number', () => {
    assert.strictEqual(normalizeNZPhoneNumber('021 555 1234'), '+64215551234');
    assert.strictEqual(normalizeNZPhoneNumber('021-555-1234'), '+64215551234');
    assert.strictEqual(normalizeNZPhoneNumber('0215551234'), '+64215551234');
  });

  await t.test('normalizes 022, 027, 028, 029 mobile prefixes', () => {
    assert.strictEqual(normalizeNZPhoneNumber('022 123 4567'), '+64221234567');
    assert.strictEqual(normalizeNZPhoneNumber('027 987 6543'), '+64279876543');
    assert.strictEqual(normalizeNZPhoneNumber('028 111 2222'), '+64281112222');
    assert.strictEqual(normalizeNZPhoneNumber('029 333 4444'), '+64293334444');
  });

  await t.test('handles numbers already with +64 or 64', () => {
    assert.strictEqual(normalizeNZPhoneNumber('+64 21 0839 8791'), '+642108398791');
    assert.strictEqual(normalizeNZPhoneNumber('642108398791'), '+642108398791');
  });

  await t.test('rejects empty or invalid phone numbers', () => {
    assert.throws(() => normalizeNZPhoneNumber(''), /Please enter a valid mobile number/);
    assert.throws(() => normalizeNZPhoneNumber('123'), /Please enter a valid New Zealand mobile number/);
    assert.throws(() => normalizeNZPhoneNumber('09 123 4567'), /Please enter a valid New Zealand mobile number/); // Landline 09
  });

  await t.test('formats phone display nicely', () => {
    assert.strictEqual(formatPhoneDisplay('+64215551234'), '+64 21 555 1234');
    assert.strictEqual(formatPhoneDisplay('0215551234'), '+64 21 555 1234');
  });
});

test('Generic Auth Error Formatting (Account Enumeration Prevention)', async (t) => {
  await t.test('returns generic message for invalid credentials', () => {
    const genericMsg = 'Incorrect email or password. Please try again.';
    assert.strictEqual(formatAuthError({ code: 'auth/invalid-email' }), genericMsg);
    assert.strictEqual(formatAuthError({ code: 'auth/user-not-found' }), genericMsg);
    assert.strictEqual(formatAuthError({ code: 'auth/wrong-password' }), genericMsg);
    assert.strictEqual(formatAuthError({ code: 'auth/invalid-credential' }), genericMsg);
    assert.strictEqual(formatAuthError({ code: 'auth/invalid-login-credentials' }), genericMsg);
  });

  await t.test('returns specific user-friendly message for phone OTP errors', () => {
    assert.strictEqual(
      formatAuthError({ code: 'auth/invalid-verification-code' }),
      'The SMS verification code entered is incorrect. Please check the code on your phone and try again.'
    );
    assert.strictEqual(
      formatAuthError({ code: 'auth/code-expired' }),
      'The SMS verification code has expired. Please request a new code.'
    );
    assert.strictEqual(
      formatAuthError({ code: 'auth/too-many-requests' }),
      'Too many attempts. Access has been temporarily blocked for security. Please try again in a few minutes.'
    );
  });
});

test('Customer Account Syncing and Data Integrity', async (t) => {
  // Mock customer storage simulator matching public/js/salon-store.js logic
  let customers = [];
  function syncCustomer(firebaseUser, extraData = {}) {
    const uid = firebaseUser.uid;
    const email = (firebaseUser.email || extraData.email || '').toLowerCase();
    const phone = (firebaseUser.phoneNumber || extraData.phone || '');
    const name = (firebaseUser.displayName || extraData.name || '');

    let index = customers.findIndex((c) => c.authUid === uid);
    if (index === -1 && email) {
      index = customers.findIndex((c) => c.email && c.email.toLowerCase() === email);
    }

    if (index >= 0) {
      const existing = customers[index];
      existing.authUid = uid;
      if (name && (!existing.name || existing.name === 'Valued Client' || existing.name === 'Guest Client')) {
        existing.name = name;
      }
      if (email && !existing.email) existing.email = email;
      if (phone && !existing.phone) existing.phone = phone;
      return existing;
    }

    const newCust = {
      id: 'cust-' + uid.slice(0, 8),
      authUid: uid,
      name: name || 'Valued Client',
      email: email,
      phone: phone,
      completedPoints: 0,
      pendingPoints: 0,
      totalSpent: 0,
      totalVisits: 0,
    };
    customers.push(newCust);
    return newCust;
  }

  await t.test('creates account with stable authUid on first Google sign-in', () => {
    const googleUser = {
      uid: 'google-uid-12345678',
      email: 'client@gmail.com',
      displayName: 'Alice Walker',
    };
    const customer = syncCustomer(googleUser);
    assert.strictEqual(customer.authUid, 'google-uid-12345678');
    assert.strictEqual(customer.name, 'Alice Walker');
    assert.strictEqual(customer.email, 'client@gmail.com');
    assert.strictEqual(customer.completedPoints, 0);

    // Simulate earning 3 points and spending $150
    customer.completedPoints = 3;
    customer.totalSpent = 150;
    customer.totalVisits = 3;
  });

  await t.test('subsequent login preserves existing loyalty points and spend', () => {
    const sameUser = {
      uid: 'google-uid-12345678',
      email: 'client@gmail.com',
      displayName: 'Alice Walker',
    };
    const retrieved = syncCustomer(sameUser);
    assert.strictEqual(retrieved.authUid, 'google-uid-12345678');
    assert.strictEqual(retrieved.completedPoints, 3, 'Completed points must be preserved');
    assert.strictEqual(retrieved.totalSpent, 150, 'Total spent must be preserved');
    assert.strictEqual(retrieved.totalVisits, 3, 'Total visits must be preserved');
  });

  await t.test('safe account linking by verified email preserves points', () => {
    // Existing pre-registered guest client with email
    customers.push({
      id: 'cust-guest-99',
      authUid: null,
      name: 'Bob Builder',
      email: 'bob@example.com',
      phone: '+64219998888',
      completedPoints: 7,
      totalSpent: 420,
      totalVisits: 7,
    });

    // Bob now logs in via Google with bob@example.com
    const bobGoogle = {
      uid: 'bob-firebase-uid-999',
      email: 'bob@example.com',
      displayName: 'Bob Builder',
    };

    const linkedBob = syncCustomer(bobGoogle);
    assert.strictEqual(linkedBob.id, 'cust-guest-99');
    assert.strictEqual(linkedBob.authUid, 'bob-firebase-uid-999');
    assert.strictEqual(linkedBob.completedPoints, 7, 'Existing loyalty balance maintained after linking');
    assert.strictEqual(linkedBob.totalSpent, 420, 'Existing spend maintained');
  });
});
