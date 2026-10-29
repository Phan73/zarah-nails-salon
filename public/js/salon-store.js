// Salon Data Store Manager
// Manages synchronized client-side data between the Admin Portal and public pages

(function() {
  window.SalonStore = {
    // Get Services
    getServices: function(defaultServices) {
      try {
        const stored = localStorage.getItem('zarah_services');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Storage read error', e);
      }
      return defaultServices !== undefined ? defaultServices : null;
    },

    // Save Services
    saveServices: function(services) {
      try {
        localStorage.setItem('zarah_services', JSON.stringify(services));
        window.dispatchEvent(new CustomEvent('zarah:services-updated', { detail: services }));
      } catch (e) {
        console.warn('Storage write error', e);
      }
    },

    // Get Team
    getTeam: function(defaultTeam) {
      try {
        const stored = localStorage.getItem('zarah_team');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Storage read error', e);
      }
      return defaultTeam !== undefined ? defaultTeam : null;
    },

    // Save Team
    saveTeam: function(team) {
      try {
        localStorage.setItem('zarah_team', JSON.stringify(team));
        window.dispatchEvent(new CustomEvent('zarah:team-updated', { detail: team }));
      } catch (e) {
        console.warn('Storage write error', e);
      }
    },

    // Get Gallery
    getGallery: function(defaultGallery) {
      try {
        const stored = localStorage.getItem('zarah_gallery');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Storage read error', e);
      }
      return defaultGallery !== undefined ? defaultGallery : null;
    },

    // Save Gallery
    saveGallery: function(gallery) {
      try {
        localStorage.setItem('zarah_gallery', JSON.stringify(gallery));
        window.dispatchEvent(new CustomEvent('zarah:gallery-updated', { detail: gallery }));
      } catch (e) {
        console.warn('Storage write error', e);
      }
    },

    // Get Colors
    getColors: function(defaultColors) {
      try {
        const stored = localStorage.getItem('zarah_colors');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Storage read error', e);
      }
      return defaultColors !== undefined ? defaultColors : null;
    },

    // Save Colors
    saveColors: function(colors) {
      try {
        localStorage.setItem('zarah_colors', JSON.stringify(colors));
        window.dispatchEvent(new CustomEvent('zarah:colors-updated', { detail: colors }));
      } catch (e) {
        console.warn('Storage write error', e);
      }
    },

    // Get Salon Info
    getSalonInfo: function(defaultInfo) {
      try {
        const stored = localStorage.getItem('zarah_salon_info');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Storage read error', e);
      }
      return defaultInfo || {};
    },

    // Save Salon Info
    saveSalonInfo: function(info) {
      try {
        localStorage.setItem('zarah_salon_info', JSON.stringify(info));
        window.dispatchEvent(new CustomEvent('zarah:info-updated', { detail: info }));
      } catch (e) {
        console.warn('Storage write error', e);
      }
    },

    // ========================================================
    // CUSTOMER ACCOUNTS & 10-DOT LOYALTY PROGRAM
    // ========================================================

    // Get Customers List
    getCustomers: function(defaultCustomers) {
      try {
        const stored = localStorage.getItem('zarah_customers');
        if (stored) {
          let list = JSON.parse(stored);
          if (Array.isArray(list)) {
            const cleaned = list.filter(c => c.id !== 'cust-1' && c.name !== 'Sarah Jenkins');
            if (cleaned.length !== list.length) {
              localStorage.setItem('zarah_customers', JSON.stringify(cleaned));
            }
            return cleaned;
          }
        }
      } catch (e) {
        console.warn('Storage read error for customers', e);
      }
      // If nothing in localStorage, initialize with defaultCustomers or empty
      if (defaultCustomers && defaultCustomers.length > 0) {
        try {
          const cleanedDefaults = defaultCustomers.filter(c => c.id !== 'cust-1' && c.name !== 'Sarah Jenkins');
          localStorage.setItem('zarah_customers', JSON.stringify(cleanedDefaults));
          return cleanedDefaults;
        } catch (e) {}
      }
      return [];
    },

    // Save Customers
    saveCustomers: function(customers) {
      try {
        localStorage.setItem('zarah_customers', JSON.stringify(customers));
        window.dispatchEvent(new CustomEvent('zarah:customers-updated', { detail: customers }));
      } catch (e) {
        console.warn('Storage write error for customers', e);
      }
    },

    // Find a Customer by Phone, Email, Name, or ID
    findCustomer: function(identifier) {
      if (!identifier) return null;
      const cleanId = String(identifier).trim().toLowerCase();
      const cleanPhone = cleanId.replace(/\D/g, '');
      const customers = this.getCustomers();

      return customers.find(c => {
        if (c.id && c.id.toLowerCase() === cleanId) return true;
        if (c.email && c.email.toLowerCase() === cleanId) return true;
        if (c.phone) {
          const cPhone = c.phone.replace(/\D/g, '');
          if (cleanPhone.length >= 7 && cPhone === cleanPhone) return true;
          if (cleanPhone.length >= 7 && (cPhone.endsWith(cleanPhone) || cleanPhone.endsWith(cPhone))) return true;
        }
        if (c.name && c.name.trim().toLowerCase() === cleanId) return true;
        return false;
      }) || null;
    },

    // Add or Update Customer
    addOrUpdateCustomer: function(custData) {
      const customers = this.getCustomers();
      let existingIndex = -1;

      if (custData.authUid) {
        existingIndex = customers.findIndex(c => c.authUid === custData.authUid);
      }
      if (existingIndex === -1 && custData.id) {
        existingIndex = customers.findIndex(c => c.id === custData.id);
      }
      if (existingIndex === -1 && custData.phone) {
        const cleanPhone = custData.phone.replace(/\D/g, '');
        if (cleanPhone.length >= 7) {
          existingIndex = customers.findIndex(c => c.phone && c.phone.replace(/\D/g, '') === cleanPhone);
        }
      }
      if (existingIndex === -1 && custData.email) {
        existingIndex = customers.findIndex(c => c.email && c.email.toLowerCase() === custData.email.toLowerCase());
      }
      if (existingIndex === -1 && custData.name && custData.name.trim().length > 1) {
        existingIndex = customers.findIndex(c => c.name && c.name.trim().toLowerCase() === custData.name.trim().toLowerCase());
      }

      if (existingIndex >= 0) {
        // Update existing customer
        customers[existingIndex] = Object.assign({}, customers[existingIndex], custData);
        this.saveCustomers(customers);
        return customers[existingIndex];
      } else {
        // Create new customer
        const newCust = Object.assign({
          id: 'cust-' + (custData.authUid ? custData.authUid.slice(0, 10) : Date.now()),
          authUid: custData.authUid || null,
          name: custData.name || 'Guest Client',
          phone: custData.phone || '',
          email: custData.email || '',
          loginProvider: custData.loginProvider || 'email',
          completedPoints: custData.completedPoints || 0,
          pendingPoints: custData.pendingPoints || 0,
          totalSpent: custData.totalSpent || 0,
          totalVisits: custData.totalVisits || 0,
          rewardsRedeemed: custData.rewardsRedeemed || 0,
          notes: custData.notes || '',
          lastVisit: custData.lastVisit || null,
          createdAt: new Date().toISOString()
        }, custData);

        customers.unshift(newCust);
        this.saveCustomers(customers);
        return newCust;
      }
    },

    // Sync Authenticated Customer from genuine identity provider (Google, Apple, Phone SMS, Email)
    syncAuthenticatedCustomer: function(firebaseUser, additionalProfileData) {
      if (!firebaseUser || !firebaseUser.uid) return null;
      const customers = this.getCustomers();
      const uid = firebaseUser.uid;
      const email = (firebaseUser.email || (additionalProfileData && additionalProfileData.email) || '').trim().toLowerCase();
      const phone = (firebaseUser.phoneNumber || (additionalProfileData && additionalProfileData.phone) || '').trim();
      const name = (firebaseUser.displayName || (additionalProfileData && additionalProfileData.name) || '').trim();

      // 1. Look up by immutable authUid
      let index = customers.findIndex(c => c.authUid === uid);

      // 2. If not found, look up by verified email or verified phone to link safely
      if (index === -1 && email) {
        index = customers.findIndex(c => c.email && c.email.toLowerCase() === email);
      }
      if (index === -1 && phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length >= 7) {
          index = customers.findIndex(c => c.phone && c.phone.replace(/\D/g, '') === cleanPhone);
        }
      }

      if (index >= 0) {
        // Link immutable authUid and update verified fields without resetting loyalty or bookings
        const existing = customers[index];
        existing.authUid = uid;
        if (name && (!existing.name || existing.name === 'Valued Client' || existing.name === 'Guest Client')) {
          existing.name = name;
        }
        if (email && !existing.email) existing.email = email;
        if (phone && !existing.phone) existing.phone = phone;
        if (firebaseUser.photoURL) existing.photoUrl = firebaseUser.photoURL;
        if (firebaseUser.providerData && firebaseUser.providerData[0] && firebaseUser.providerData[0].providerId) {
          existing.loginProvider = firebaseUser.providerData[0].providerId;
        }
        this.saveCustomers(customers);
        this.setCurrentCustomer(existing);
        return existing;
      }

      // 3. Create fresh new customer profile tied to this authUid
      const newCustomer = {
        id: 'cust-' + uid.slice(0, 10),
        authUid: uid,
        name: name || 'Valued Client',
        email: email,
        phone: phone,
        photoUrl: firebaseUser.photoURL || '',
        loginProvider: (firebaseUser.providerData && firebaseUser.providerData[0] && firebaseUser.providerData[0].providerId) || 'password',
        completedPoints: 0,
        pendingPoints: 0,
        totalSpent: 0,
        totalVisits: 0,
        rewardsRedeemed: 0,
        notes: '',
        lastVisit: null,
        createdAt: new Date().toISOString()
      };

      customers.unshift(newCustomer);
      this.saveCustomers(customers);
      this.setCurrentCustomer(newCustomer);
      return newCustomer;
    },

    // Calculate the 10 Dots representation
    // Returns: { green: N, orange: N, white: N, isEligibleForFree: boolean, totalCompleted: N }
    calculateDots: function(customer) {
      if (!customer) {
        return { green: 0, orange: 0, white: 10, isEligibleForFree: false, totalCompleted: 0 };
      }
      const completed = parseInt(customer.completedPoints, 10) || 0;
      const pending = parseInt(customer.pendingPoints, 10) || 0;

      const green = Math.min(10, completed);
      const orange = Math.min(10 - green, pending);
      const white = Math.max(0, 10 - green - orange);
      const isEligibleForFree = green >= 10;

      return {
        green: green,
        orange: orange,
        white: white,
        isEligibleForFree: isEligibleForFree,
        totalCompleted: completed,
        totalPending: pending
      };
    },

    // Render 10 Dots HTML
    renderDotsHtml: function(customer, compact) {
      const dots = this.calculateDots(customer);
      let html = `<div class="loyalty-dots-track ${compact ? 'compact' : ''} ${dots.isEligibleForFree ? 'milestone-unlocked' : ''}">`;

      // 1. Green Dots (Completed at salon / $50+ minimum spent)
      for (let i = 0; i < dots.green; i++) {
        html += `<span class="loyalty-dot dot-green" title="Completed Visit #${i+1} (Earned Point)"></span>`;
      }
      // 2. Orange Dots (Booked / pending arrival at salon)
      for (let i = 0; i < dots.orange; i++) {
        html += `<span class="loyalty-dot dot-orange" title="Active Booking (Pending visit at salon)"></span>`;
      }
      // 3. White Dots (Unearned / remaining slots)
      for (let i = 0; i < dots.white; i++) {
        html += `<span class="loyalty-dot dot-white" title="Slot #${dots.green + dots.orange + i + 1} (Empty)"></span>`;
      }

      html += `</div>`;
      return html;
    },

    // Complete a Visit (turn 1 orange dot into green, or add 1 green dot)
    // Automatically checks if 10 green dots are reached!
    completeCustomerVisit: function(identifier, amount) {
      let customer = this.findCustomer(identifier);
      const cost = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 50;

      if (!customer) {
        // If not found, create new customer with 1 completed visit!
        customer = this.addOrUpdateCustomer({
          name: typeof identifier === 'string' && !identifier.match(/^\+?[0-9\s-]{7,}$/) && !identifier.includes('@') ? identifier : 'Valued Client',
          phone: typeof identifier === 'string' && identifier.match(/^\+?[0-9\s-]{7,}$/) ? identifier : '',
          email: typeof identifier === 'string' && identifier.includes('@') ? identifier : '',
          completedPoints: 1,
          pendingPoints: 0,
          totalVisits: 1,
          totalSpent: cost,
          lastVisit: new Date().toISOString().split('T')[0]
        });
        return {
          customer: customer,
          isEligibleForFree: false
        };
      }

      // Deduct 1 pending if available, otherwise just add completed
      if (customer.pendingPoints > 0) {
        customer.pendingPoints--;
      }
      customer.completedPoints = (customer.completedPoints || 0) + 1;
      customer.totalVisits = (customer.totalVisits || 0) + 1;
      customer.totalSpent = (customer.totalSpent || 0) + cost;
      customer.lastVisit = new Date().toISOString().split('T')[0];

      const isEligibleForFree = customer.completedPoints >= 10;
      this.addOrUpdateCustomer(customer);

      // If this customer is currently logged in in this session, update session
      const current = this.getCurrentCustomer();
      if (current && current.id === customer.id) {
        this.setCurrentCustomer(customer);
      }

      return {
        customer: customer,
        isEligibleForFree: isEligibleForFree
      };
    },

    // Add a Booking Point (holds 1 Orange Dot for active booking)
    addBookingPoint: function(identifier) {
      let customer = this.findCustomer(identifier);
      if (!customer) {
        // Auto-create client with 1 orange pending point!
        customer = this.addOrUpdateCustomer({
          name: typeof identifier === 'string' && !identifier.match(/^\+?[0-9\s-]{7,}$/) && !identifier.includes('@') ? identifier : 'Valued Client',
          phone: typeof identifier === 'string' && identifier.match(/^\+?[0-9\s-]{7,}$/) ? identifier : '',
          email: typeof identifier === 'string' && identifier.includes('@') ? identifier : '',
          completedPoints: 0,
          pendingPoints: 1
        });
        return customer;
      }

      customer.pendingPoints = (parseInt(customer.pendingPoints, 10) || 0) + 1;
      this.addOrUpdateCustomer(customer);

      const current = this.getCurrentCustomer();
      if (current && current.id === customer.id) {
        this.setCurrentCustomer(customer);
      }
      return customer;
    },

    // Register or update customer for a new booking, guaranteeing 1 Orange Pending Dot (🟠)
    registerCustomerBooking: function(clientInfo) {
      if (!clientInfo) return null;
      const name = (clientInfo.name || clientInfo.clientName || '').trim();
      const phone = (clientInfo.phone || clientInfo.clientPhone || '').trim();
      const email = (clientInfo.email || clientInfo.clientEmail || '').trim();
      const service = clientInfo.serviceName || clientInfo.service || '';
      const notes = clientInfo.notes || clientInfo.clientNotes || '';
      const source = clientInfo.source || 'Online Booking';

      // Look up existing by phone, email, or name
      let customer = null;
      if (phone) customer = this.findCustomer(phone);
      if (!customer && email) customer = this.findCustomer(email);
      if (!customer && name) customer = this.findCustomer(name);

      if (customer) {
        // Increment pending orange dot for the active booking
        customer.pendingPoints = (parseInt(customer.pendingPoints, 10) || 0) + 1;
        if (service && !customer.favoriteService) customer.favoriteService = service;
        if (phone && !customer.phone) customer.phone = phone;
        if (email && !customer.email) customer.email = email;
        if (notes && !customer.notes) customer.notes = notes;
        this.addOrUpdateCustomer(customer);
        return customer;
      } else {
        // Create new customer with 1 Orange Pending Point (🟠)
        const newCust = this.addOrUpdateCustomer({
          name: name || 'Valued Client',
          phone: phone,
          email: email,
          loginProvider: source.toLowerCase().includes('facebook') ? 'facebook' : (phone ? 'phone' : 'guest'),
          completedPoints: 0,
          pendingPoints: 1, // 1 Orange Dot for this booking!
          totalSpent: 0,
          totalVisits: 0,
          rewardsRedeemed: 0,
          favoriteService: service || 'Signature Gel Manicure',
          notes: notes ? `${source}: ${notes}` : `Booked via ${source}`,
          createdAt: new Date().toISOString()
        });
        return newCust;
      }
    },

    // Redeem Free Service Reward (resets 10 green dots for the next reward cycle)
    redeemReward: function(customerId) {
      const customers = this.getCustomers();
      const customer = customers.find(c => c.id === customerId);
      if (!customer) return null;

      if (customer.completedPoints >= 10) {
        customer.completedPoints = customer.completedPoints - 10;
      } else {
        customer.completedPoints = 0;
      }
      customer.rewardsRedeemed = (customer.rewardsRedeemed || 0) + 1;
      this.saveCustomers(customers);

      const current = this.getCurrentCustomer();
      if (current && current.id === customer.id) {
        this.setCurrentCustomer(customer);
      }

      window.dispatchEvent(new CustomEvent('zarah:reward-redeemed', { detail: customer }));
      return customer;
    },

    // Current Customer Session Auth
    getCurrentCustomer: function() {
      try {
        const stored = localStorage.getItem('zarah_current_customer');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.id === 'cust-1' || parsed.name === 'Sarah Jenkins')) {
            localStorage.removeItem('zarah_current_customer');
            return null;
          }
          return parsed;
        }
      } catch (e) {
        console.warn('Error reading customer session', e);
      }
      return null;
    },

    setCurrentCustomer: function(customer) {
      try {
        localStorage.setItem('zarah_current_customer', JSON.stringify(customer));
        window.dispatchEvent(new CustomEvent('zarah:auth-changed', { detail: customer }));
      } catch (e) {
        console.warn('Error saving customer session', e);
      }
    },

    logoutCustomer: function() {
      try {
        localStorage.removeItem('zarah_current_customer');
        window.dispatchEvent(new CustomEvent('zarah:auth-changed', { detail: null }));
      } catch (e) {
        console.warn('Error logging out customer', e);
      }
    },

    // ========================================================
    // UNIFIED AUTHENTICATION & STAFF ACCOUNTS MANAGEMENT
    // ========================================================

    // Default seed staff accounts
    getDefaultStaffAccounts: function() {
      return [
        { id: 'staff-acc-1', staffId: 'chloe', name: 'Chloe', username: 'chloe', password: 'staff123', role: 'staff', active: true, createdAt: '2026-10-20' },
        { id: 'staff-acc-2', staffId: 'priya', name: 'Priya', username: 'priya', password: 'staff123', role: 'staff', active: true, createdAt: '2026-10-20' },
        { id: 'staff-acc-3', staffId: 'zarah', name: 'Zarah', username: 'zarah', password: 'staff123', role: 'staff', active: true, createdAt: '2026-10-20' }
      ];
    },

    // Get Staff Accounts
    getStaffAccounts: function() {
      try {
        const stored = localStorage.getItem('zarah_staff_accounts');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Storage read error for staff accounts', e);
      }
      const defaults = this.getDefaultStaffAccounts();
      try {
        localStorage.setItem('zarah_staff_accounts', JSON.stringify(defaults));
      } catch (e) {}
      return defaults;
    },

    // Save Staff Accounts
    saveStaffAccounts: function(accounts) {
      try {
        localStorage.setItem('zarah_staff_accounts', JSON.stringify(accounts));
        window.dispatchEvent(new CustomEvent('zarah:staff-accounts-updated', { detail: accounts }));
      } catch (e) {
        console.warn('Storage write error for staff accounts', e);
      }
    },

    // Add or Update Staff Account
    addOrUpdateStaffAccount: function(accData) {
      const accounts = this.getStaffAccounts();
      const existingIdx = accounts.findIndex(a => a.id === accData.id || a.username.toLowerCase() === accData.username.toLowerCase());

      if (existingIdx >= 0) {
        accounts[existingIdx] = Object.assign({}, accounts[existingIdx], accData);
        this.saveStaffAccounts(accounts);
        return accounts[existingIdx];
      } else {
        const newAcc = Object.assign({
          id: 'staff-acc-' + Date.now(),
          staffId: accData.staffId || accData.username.toLowerCase(),
          name: accData.name || 'Staff Member',
          username: accData.username.toLowerCase(),
          password: accData.password || 'staff123',
          role: accData.role || 'staff',
          active: true,
          createdAt: new Date().toISOString().split('T')[0]
        }, accData);
        accounts.push(newAcc);
        this.saveStaffAccounts(accounts);
        return newAcc;
      }
    },

    // Delete Staff Account
    deleteStaffAccount: function(id) {
      const accounts = this.getStaffAccounts().filter(a => a.id !== id);
      this.saveStaffAccounts(accounts);
    },

    // Unified Login Handler (Admin, Staff, Customer)
    loginWithCredentials: function(identifier, password) {
      const cleanId = String(identifier || '').trim();
      const cleanPass = String(password || '').trim();

      // 1. Check Admin Credentials: admin / 258046
      if (cleanId.toLowerCase() === 'admin' && cleanPass === '258046') {
        const adminUser = { role: 'admin', name: 'Salon Admin / Owner', username: 'admin' };
        try {
          sessionStorage.setItem('zarah_staff_auth', 'true');
          sessionStorage.setItem('zarah_role', 'admin');
          sessionStorage.setItem('zarah_user_name', 'Salon Admin / Owner');
          localStorage.setItem('zarah_logged_in_user', JSON.stringify(adminUser));
          localStorage.removeItem('zarah_current_customer');
          window.dispatchEvent(new CustomEvent('zarah:auth-changed', { detail: adminUser }));
        } catch (e) {}
        return { success: true, type: 'admin', user: adminUser };
      }

      // 2. Check Staff Accounts
      const staffAccounts = this.getStaffAccounts();
      const staffMatch = staffAccounts.find(a => 
        a.username.toLowerCase() === cleanId.toLowerCase() && 
        a.password === cleanPass && 
        a.active !== false
      );

      if (staffMatch) {
        const staffUser = { 
          role: staffMatch.role || 'staff', 
          name: staffMatch.name, 
          staffId: staffMatch.staffId, 
          username: staffMatch.username 
        };
        try {
          sessionStorage.setItem('zarah_staff_auth', 'true');
          sessionStorage.setItem('zarah_role', staffMatch.role || 'staff');
          sessionStorage.setItem('zarah_user_name', staffMatch.name);
          sessionStorage.setItem('zarah_staff_id', staffMatch.staffId || '');
          localStorage.setItem('zarah_logged_in_user', JSON.stringify(staffUser));
          localStorage.removeItem('zarah_current_customer');
          window.dispatchEvent(new CustomEvent('zarah:auth-changed', { detail: staffUser }));
        } catch (e) {}
        return { success: true, type: 'staff', user: staffUser };
      }

      // Customer authentication is strictly handled via ZarahAuth (Firebase Auth)
      // to ensure real password verification, rate-limiting, and zero plain-text impersonation.
      return { 
        success: false, 
        message: 'Incorrect login details. Please check your username, email, or password and try again.' 
      };
    },

    // Get Currently Logged In Account (Admin, Staff, or Customer)
    getLoggedInUser: function() {
      try {
        const staffOrAdmin = localStorage.getItem('zarah_logged_in_user');
        if (staffOrAdmin) {
          const parsed = JSON.parse(staffOrAdmin);
          return parsed;
        }
        const customer = this.getCurrentCustomer();
        if (customer) {
          return Object.assign({ role: 'customer' }, customer);
        }
      } catch (e) {}
      return null;
    },

    // Logout Everything
    logoutAll: function() {
      try {
        sessionStorage.removeItem('zarah_staff_auth');
        sessionStorage.removeItem('zarah_role');
        sessionStorage.removeItem('zarah_user_name');
        sessionStorage.removeItem('zarah_staff_id');
        localStorage.removeItem('zarah_logged_in_user');
        localStorage.removeItem('zarah_current_customer');
        window.dispatchEvent(new CustomEvent('zarah:auth-changed', { detail: null }));
      } catch (e) {}
    },

    // ========================================================
    // GOOGLE REVIEWS INTEGRATION & AUTO-UPDATE
    // ========================================================

    // Get Google Reviews (strictly 4+ stars, most recent first)
    getGoogleReviews: function(defaultReviews) {
      try {
        const stored = localStorage.getItem('zarah_google_reviews');
        if (stored) {
          const list = JSON.parse(stored);
          return list
            .filter(r => (parseFloat(r.rating) || 5) >= 4)
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }
      } catch (e) {
        console.warn('Storage read error for google reviews', e);
      }

      if (defaultReviews && defaultReviews.length > 0) {
        try {
          localStorage.setItem('zarah_google_reviews', JSON.stringify(defaultReviews));
        } catch (e) {}
        return defaultReviews
          .filter(r => (parseFloat(r.rating) || 5) >= 4)
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      }
      return [];
    },

    // Save Google Reviews
    saveGoogleReviews: function(reviews) {
      try {
        localStorage.setItem('zarah_google_reviews', JSON.stringify(reviews));
        window.dispatchEvent(new CustomEvent('zarah:google-reviews-updated', { detail: reviews }));
      } catch (e) {
        console.warn('Storage write error for google reviews', e);
      }
    },

    // Add or Update a Google Review (auto-filters < 4 stars)
    addGoogleReview: function(reviewData) {
      const rating = parseFloat(reviewData.rating) || 5;
      if (rating < 4) {
        console.warn('Google review filtered out: only 4-star and above reviews are displayed.');
        return null;
      }

      const reviews = this.getGoogleReviews();
      const newReview = {
        id: reviewData.id || 'g-rev-' + Date.now(),
        author_name: reviewData.author_name || reviewData.name || 'Google Customer',
        rating: rating,
        relative_time_description: reviewData.relative_time_description || 'Recently',
        timestamp: reviewData.timestamp || Date.now(),
        text: reviewData.text || reviewData.content || '',
        service: reviewData.service || 'Nails & Beauty',
        verified_google: true,
        profile_photo_url: reviewData.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewData.author_name || 'GC')}&background=C48B71&color=fff&size=100`
      };

      const existingIdx = reviews.findIndex(r => r.id === newReview.id || (r.author_name === newReview.author_name && r.text === newReview.text));
      if (existingIdx >= 0) {
        reviews[existingIdx] = Object.assign({}, reviews[existingIdx], newReview);
      } else {
        reviews.unshift(newReview);
      }

      this.saveGoogleReviews(reviews);
      return newReview;
    },

    deleteGoogleReview: function(reviewId) {
      const reviews = this.getGoogleReviews();
      const filtered = reviews.filter(r => r.id !== reviewId);
      this.saveGoogleReviews(filtered);
      return filtered;
    },

    resetGoogleReviews: function(defaultReviews) {
      if (defaultReviews) {
        this.saveGoogleReviews(defaultReviews);
        return defaultReviews;
      }
      return this.getGoogleReviews();
    }
  };
})();
