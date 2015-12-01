'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libJsonFetcher = require('../lib/jsonFetcher');

var _libJsonFetcher2 = _interopRequireDefault(_libJsonFetcher);

var _libFuDispatcher = require('../lib/fu-dispatcher');

var _libFuDispatcher2 = _interopRequireDefault(_libFuDispatcher);

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

// TODOS:
// --turn into a class.
// --make it a factory function like we do with store prototype.

var ActionPrototype = {
  specialTypes: _keymirror2['default']({
    GOT_MSG: null
  }),
  originalActions: {},
  stubForTests: function stubForTests() {
    var _this = this;

    this.receivedData = {};
    var actions = Object.getOwnPropertyNames(this).filter(function (fn) {
      return typeof _this[fn] === 'function';
    });
    actions.forEach(function (action) {
      if (['fireApi', 'stubForTests', 'stubbedAction', 'saveAction', 'restore'].indexOf(action) < 0) {
        _this.saveAction(action);
        _this[action] = function (data) {
          _this.stubbedAction(action, data);
        };
      }
    });
  },
  stubbedAction: function stubbedAction(actionName, data) {
    this.receivedData[actionName] = data;
  },
  saveAction: function saveAction(action) {
    this.originalActions[action] = this[action];
  },
  restore: function restore() {
    var _this2 = this;

    var originals = Object.getOwnPropertyNames(this.originalActions).filter(function (action) {
      return typeof _this2.originalActions[action] === 'function';
    });
    originals.forEach(function (action) {
      _this2[action] = _this2.originalActions[action];
    });
    this.originalActions = {};
  },
  fireApi: function fireApi(method, url, data, options) {
    // set default values
    var errorAction = options.errorAction ? options.errorAction : options.successAction;
    _libJsonFetcher2['default'][method](_libJsonFetcher2['default'], url, data).then((function (successData) {
      if (options.successAction) {
        _libFuDispatcher2['default'].dispatch({
          actionType: options.successAction,
          data: options.JSONHead ? successData[options.JSONHead] : successData
        });
      }
      if (options.onSuccess) {
        options.onSuccess.apply();
      }
      if (options.successMsg) {
        _libFuDispatcher2['default'].dispatch({
          actionType: this.specialTypes.GOT_MSG,
          data: options.successMsg
        });
      }
    }).bind(this)).fail(function (failureData) {
      var scopedErrors = options.JSONHead ? failureData[options.JSONHead] : failureData;
      var errors = scopedErrors ? scopedErrors.errors : failureData.errors;
      _libFuDispatcher2['default'].dispatch({
        actionType: errorAction,
        data: { errors: errors }
      });
    });
  }
};

exports['default'] = ActionPrototype;
module.exports = exports['default'];