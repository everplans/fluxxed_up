'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

var _ActionPrototype = require('./ActionPrototype');

var _ActionPrototype2 = _interopRequireDefault(_ActionPrototype);

var _fuDispatcher = require('./fu-dispatcher');

var _fuDispatcher2 = _interopRequireDefault(_fuDispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ActionFactory = function () {
  // Take an array of strings which are converted to action Types via keyMirror:
  function ActionFactory(actionTypes) {
    _classCallCheck(this, ActionFactory);

    this.Types = (0, _keymirror2.default)(actionTypes.reduce(function (previous, keyName) {
      previous[keyName] = null;
      return previous;
    }, {}));
    Object.assign(this, _ActionPrototype2.default); // TODO: make all actions use this class and won't need the prototype
  }

  _createClass(ActionFactory, [{
    key: 'buildAction',
    value: function buildAction(name, method, url, options) {
      var _this = this;

      this[name] = function (data) {
        return _this.fireApi(method, url, data, options);
      };
    }
    // Build an action function that just dispatches a Type with the passed data payload:
  }, {
    key: 'buildActionDispatch',
    value: function buildActionDispatch(name, type) {
      this[name] = function (data) {
        return _fuDispatcher2.default.dispatch({ actionType: type, data: data });
      };
    }
  }]);

  return ActionFactory;
}();

exports.default = ActionFactory;
module.exports = exports['default'];