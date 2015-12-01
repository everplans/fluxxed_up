'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var FeatureFlags = (function () {
  function FeatureFlags() {
    _classCallCheck(this, FeatureFlags);
  }

  FeatureFlags.prototype.init = function init(flags) {
    var _this = this;

    this.flags = {};
    flags.map(function (flagObject) {
      _this.flags[flagObject.flag] = flagObject.status;
    });
  };

  FeatureFlags.prototype.isEnabled = function isEnabled(flagName) {
    return this.flags && this.flags[flagName] ? String(this.flags[flagName]).toUpperCase() === 'ENABLED' : false;
  };

  return FeatureFlags;
})();

module.exports = new FeatureFlags(); // specifically want a singleton