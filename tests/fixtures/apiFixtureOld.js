const { test: base, expect } = require('@playwright/test');

// Reusable headers
const headers = { 'Content-Type': 'application/json' };

// Create fixture
const test = base.extend({
  apiContext: async ({ request }, use) => {
    await use({
      /**
       * @param {string} url 
       * @param {Object} options 
       * @returns {Promise<import('@playwright/test').APIResponse>}
       */
      get: (url, options = {}) => request.get(url, { headers: { ...headers, ...options.headers }, ...options }),
      
      /**
       * @param {string} url 
       * @param {*} data 
       * @param {Object} options 
       * @returns {Promise<import('@playwright/test').APIResponse>}
       */
      post: (url, data, options = {}) => request.post(url, { headers: { ...headers, ...options.headers }, data, ...options }),
      
      /**
       * @param {string} url 
       * @param {*} data 
       * @param {Object} options 
       * @returns {Promise<import('@playwright/test').APIResponse>}
       */
      put: (url, data, options = {}) => request.put(url, { headers: { ...headers, ...options.headers }, data, ...options }),
      
      /**
       * @param {string} url 
       * @param {Object} options 
       * @returns {Promise<import('@playwright/test').APIResponse>}
       */
      delete: (url, options = {}) => request.delete(url, { headers: { ...headers, ...options.headers }, ...options })
    });
  }
});

module.exports = { test, expect };
