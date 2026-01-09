// Authentication and Cookie Management Service
const AuthService = {
    // Cookie helper functions
    setCookie: function(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/`;
    },

    getCookie: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                try {
                    return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    },

    deleteCookie: function(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    },

    // Authentication methods
    login: function(username, password) {
        // Simple authentication - in production, this should be server-side
        // For demo purposes, accept any username/password
        if (username && password) {
            this.setCookie('isLoggedIn', true, 7); // 7 days
            this.setCookie('username', username, 7);
            this.setCookie('loginTime', new Date().toISOString(), 7);
            return true;
        }
        return false;
    },

    logout: function() {
        this.deleteCookie('isLoggedIn');
        this.deleteCookie('username');
        this.deleteCookie('loginTime');
        window.location.href = 'login.html';
    },

    isLoggedIn: function() {
        return this.getCookie('isLoggedIn') === true;
    },

    getUsername: function() {
        return this.getCookie('username') || '';
    }
};

// Utility Service for Random Delays (to mimic slow production server)
const ServerDelayService = {
    /**
     * Generate a random delay between min and max seconds
     * @param {number} minSeconds - Minimum delay in seconds (default: 3)
     * @param {number} maxSeconds - Maximum delay in seconds (default: 15)
     * @returns {number} Random delay in milliseconds
     */
    generateRandomDelay: function(minSeconds = 3, maxSeconds = 15) {
        const minMs = minSeconds * 1000;
        const maxMs = maxSeconds * 1000;
        return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    },

    /**
     * Create a promise that resolves after a random delay
     * @param {number} minSeconds - Minimum delay in seconds (default: 3)
     * @param {number} maxSeconds - Maximum delay in seconds (default: 15)
     * @returns {Promise} Promise that resolves after the random delay
     */
    randomDelay: function(minSeconds = 3, maxSeconds = 15) {
        const delayMs = this.generateRandomDelay(minSeconds, maxSeconds);
        return new Promise(resolve => setTimeout(resolve, delayMs));
    },

    /**
     * Simulate a server request with random delay
     * @param {Function} callback - Function to execute after delay
     * @param {number} minSeconds - Minimum delay in seconds (default: 3)
     * @param {number} maxSeconds - Maximum delay in seconds (default: 15)
     * @param {Function} onProgress - Optional callback during delay (receives elapsed time, total time)
     * @returns {Promise} Promise that resolves when callback completes
     */
    simulateServerRequest: async function(callback, minSeconds = 3, maxSeconds = 15, onProgress = null) {
        const delayMs = this.generateRandomDelay(minSeconds, maxSeconds);
        const startTime = Date.now();
        let progressInterval = null;
        
        // Call onProgress callback during delay if provided
        if (onProgress) {
            progressInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                onProgress(elapsed, delayMs);
                if (elapsed >= delayMs) {
                    clearInterval(progressInterval);
                }
            }, 100); // Update every 100ms
        }
        
        await new Promise(resolve => setTimeout(resolve, delayMs));
        
        // Clear progress interval if it exists
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        
        return callback();
    }
};

// FIR Data Management Service
const FIRService = {
    // Get all FIRs from cookies
    getAllFIRs: function() {
        const firs = this.getCookie('firs');
        return firs || [];
    },

    // Get a single FIR by ID
    getFIR: function(id) {
        const firs = this.getAllFIRs();
        return firs.find(fir => fir.id === id) || null;
    },

    // Save a new FIR
    saveFIR: function(firData) {
        const firs = this.getAllFIRs();
        const newFIR = {
            id: this.generateId(),
            ...firData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        firs.push(newFIR);
        this.setCookie('firs', firs, 365); // Store for 1 year
        return newFIR.id;
    },

    // Update an existing FIR
    updateFIR: function(id, firData) {
        const firs = this.getAllFIRs();
        const index = firs.findIndex(fir => fir.id === id);
        if (index !== -1) {
            firs[index] = {
                ...firs[index],
                ...firData,
                updatedAt: new Date().toISOString()
            };
            this.setCookie('firs', firs, 365);
            return true;
        }
        return false;
    },

    // Delete a FIR
    deleteFIR: function(id) {
        const firs = this.getAllFIRs();
        const filtered = firs.filter(fir => fir.id !== id);
        this.setCookie('firs', filtered, 365);
        return filtered.length !== firs.length;
    },

    // Save FIR directly (for initial creation)
    saveFIRDirect: function(firData) {
        const firs = this.getAllFIRs();
        const index = firs.findIndex(fir => fir.id === firData.id);
        if (index !== -1) {
            firs[index] = firData;
        } else {
            firs.push(firData);
        }
        this.setCookie('firs', firs, 365);
        return firData.id;
    },

    // Generate unique ID
    generateId: function() {
        return 'FIR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    },

    // Cookie helper methods (using AuthService methods)
    setCookie: function(name, value, days) {
        AuthService.setCookie(name, value, days);
    },

    getCookie: function(name) {
        return AuthService.getCookie(name);
    }
};

