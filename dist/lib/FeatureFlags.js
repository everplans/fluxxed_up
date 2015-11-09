'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var FeatureFlags = (function () {
  function FeatureFlags() {
    _classCallCheck(this, FeatureFlags);
  }

  FeatureFlags.prototype.init = function init(flags) {
    var _this = this;

    this.flags = {};
    flags.map(function (f) {
      _this.flags[f.flag] = f.status;
    });
  };

  FeatureFlags.prototype.isEnabled = function isEnabled(flag) {
    return this.flags && this.flags[flag] ? String(this.flags[flag]).toUpperCase() === 'ENABLED' : false;
  };

  return FeatureFlags;
})();

module.exports = new FeatureFlags(); // specifically want a singleton