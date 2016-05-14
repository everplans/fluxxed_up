'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

var _ActionPrototype = require('./ActionPrototype');

var _ActionPrototype2 = _interopRequireDefault(_ActionPrototype);

var _fuDispatcher = require('./fu-dispatcher');

var _fuDispatcher2 = _interopRequireDefault(_fuDispatcher);

var ActionFactory = (function () {
  // Take an array of strings which are converted to action Types via keyMirror:
  function ActionFactory(actionTypes) {
    _classCallCheck(this, ActionFactory);

    this.Types = _keymirror2['default'](actionTypes.reduce(function (previous, keyName) {
      previous[keyName] = null;
      return previous;
    }, {}));
    Object.assign(this, _ActionPrototype2['default']); // TODO: make all actions use this class and won't need the prototype
  }

  ActionFactory.prototype.buildAction = function buildAction(name, method, url, options) {
    var _this = this;

    this[name] = function (data) {
      return _this.fireApi(method, url, data, options);
    };
  };

  // Build an action function that just dispatches a Type with the passed data payload:
  ActionFactory.prototype.buildActionDispatch = function buildActionDispatch(name, type) {
    this[name] = function (data) {
      return _fuDispatcher2['default'].dispatch({ actionType: type, data: data });
    };
  };

  return ActionFactory;
})();

exports['default'] = ActionFactory;
module.exports = exports['default'];