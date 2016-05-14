'use strict';

var storage = {};

var extra_storage = {
  getItem: function getItem(key) {
    try {
      window.sessionStorage.setItem('__extra_storage-flag__', 'test');
      return window.sessionStorage.getItem(key);
    } catch (error) {
      return storage[key];
    }
  },
  setItem: function setItem(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      storage[key] = value;
    }
  },
  removeItem: function removeItem(key) {
    try {
      return window.sessionStorage.removeItem(key);
    } catch (error) {
      storage[key] = undefined;
      return undefined;
    }
  }
};

module.exports = extra_storage;