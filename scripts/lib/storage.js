// DE-MAJ Architecture - Storage Utilities

/**
 * Local Storage wrapper with error handling
 */
export const storage = {
  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*}
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
      return false;
    }
  },
  
  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
      return false;
    }
  },
  
  /**
   * Clear all localStorage
   * @returns {boolean} Success status
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
      return false;
    }
  },
  
  /**
   * Check if key exists in localStorage
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  },
  
  /**
   * Get all keys from localStorage
   * @returns {string[]}
   */
  keys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }
    return keys;
  }
};

/**
 * Session Storage wrapper with error handling
 */
export const sessionStorage = {
  /**
   * Get item from sessionStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*}
   */
  get(key, defaultValue = null) {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Error reading from sessionStorage:', error);
      return defaultValue;
    }
  },
  
  /**
   * Set item in sessionStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('Error writing to sessionStorage:', error);
      return false;
    }
  },
  
  /**
   * Remove item from sessionStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Error removing from sessionStorage:', error);
      return false;
    }
  },
  
  /**
   * Clear all sessionStorage
   * @returns {boolean} Success status
   */
  clear() {
    try {
      window.sessionStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing sessionStorage:', error);
      return false;
    }
  }
};

/**
 * IndexedDB wrapper for complex data storage
 */
export const db = {
  dbName: 'de-maj-architecture',
  version: 1,
  db: null,
  
  /**
   * Initialize IndexedDB
   * @returns {Promise<IDBDatabase>}
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        
        if (!db.objectStoreNames.contains('catalogue')) {
          db.createObjectStore('catalogue', { keyPath: 'id' });
        }
      };
    });
  },
  
  /**
   * Get data from IndexedDB
   * @param {string} storeName - Object store name
   * @param {string} key - Data key
   * @returns {Promise<*>}
   */
  async get(storeName, key) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },
  
  /**
   * Set data in IndexedDB
   * @param {string} storeName - Object store name
   * @param {*} data - Data to store
   * @returns {Promise<boolean>}
   */
  async set(storeName, data) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  },
  
  /**
   * Get all data from IndexedDB store
   * @param {string} storeName - Object store name
   * @returns {Promise<Array>}
   */
  async getAll(storeName) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },
  
  /**
   * Delete data from IndexedDB
   * @param {string} storeName - Object store name
   * @param {string} key - Data key
   * @returns {Promise<boolean>}
   */
  async delete(storeName, key) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  }
};

/**
 * Export/Import utilities
 */
export const exportData = {
  /**
   * Export data as JSON file
   * @param {*} data - Data to export
   * @param {string} filename - Export filename
   */
  async exportJSON(data, filename = 'data.json') {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  /**
   * Import JSON file
   * @param {File} file - File to import
   * @returns {Promise<*>}
   */
  async importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }
};

/**
 * Cache management
 */
export const cache = {
  prefix: 'de-maj-cache-',
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  
  /**
   * Set cached data with TTL
   * @param {string} key - Cache key
   * @param {*} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, data, ttl = this.ttl) {
    const cacheKey = `${this.prefix}${key}`;
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    storage.set(cacheKey, cacheData);
  },
  
  /**
   * Get cached data
   * @param {string} key - Cache key
   * @param {*} defaultValue - Default value if cache miss or expired
   * @returns {*}
   */
  get(key, defaultValue = null) {
    const cacheKey = `${this.prefix}${key}`;
    const cached = storage.get(cacheKey);
    
    if (!cached) return defaultValue;
    
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      storage.remove(cacheKey);
      return defaultValue;
    }
    
    return cached.data;
  },
  
  /**
   * Clear cache
   * @param {string} pattern - Pattern to match cache keys
   */
  clear(pattern = this.prefix) {
    const keys = storage.keys();
    keys.forEach(key => {
      if (key.startsWith(pattern)) {
        storage.remove(key);
      }
    });
  }
};
