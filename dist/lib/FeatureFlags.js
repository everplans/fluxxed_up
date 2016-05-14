'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FeatureFlags = function () {
  function FeatureFlags() {
    _classCallCheck(this, FeatureFlags);
  }

  _createClass(FeatureFlags, [{
    key: 'init',
    value: function init(flags) {
      var _this = this;

      this.flags = {};
      flags.map(function (flagObject) {
        _this.flags[flagObject.flag] = flagObject.status;
      });
    }
  }, {
    key: 'isEnabled',
    value: function isEnabled(flagName) {
      return this.flags && this.flags[flagName] ? String(this.flags[flagName]).toUpperCase() === 'ENABLED' : false;
    }
  }]);

  return FeatureFlags;
}();

module.exports = new FeatureFlags(); // specifically want a singleton