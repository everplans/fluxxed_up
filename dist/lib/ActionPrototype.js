'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libJsonFetcher = require('../lib/jsonFetcher');

var _libJsonFetcher2 = _interopRequireDefault(_libJsonFetcher);

var _libEpDispatcher = require('../lib/ep-dispatcher');

var _libEpDispatcher2 = _interopRequireDefault(_libEpDispatcher);

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

//TODOS:
//--turn into a class.
//--make it a factory function like we do with store prototype.

var ActionPrototype = {
  specialTypes: _keymirror2['default']({
    GOT_MSG: null
  }),
  originalActions: {},
  stubForTests: function stubForTests() {
    var _this = this;

    this.recievedData = {};
    var actions = Object.getOwnPropertyNames(this).filter(function (fn) {
      return typeof _this[fn] === 'function';
    });
    actions.forEach(function (action) {
      if (['fireApi', 'stubForTests', 'stubedAction', 'saveAction', 'restore'].indexOf(action) < 0) {
        _this.saveAction(action);
        _this[action] = function (data) {
          _this.stubedAction(action, data);
        };
      }
    });
  },
  stubedAction: function stubedAction(actionName, data) {
    this.recievedData[actionName] = data;
  },
  saveAction: function saveAction(action) {
    this.originalActions[action] = this[action];
  },
  restore: function restore() {
    var _this2 = this;

    var orignals = Object.getOwnPropertyNames(this.originalActions).filter(function (fn) {
      return typeof _this2.originalActions[fn] === 'function';
    });
    orignals.forEach(function (fn) {
      _this2[fn] = _this2.originalActions[fn];
    });
    this.originalActions = {};
  },
  fireApi: function fireApi(method, url, data, options) {
    //set default values
    var errorAction = options.errorAction ? options.errorAction : options.successAction;
    _libJsonFetcher2['default'][method].call(_libJsonFetcher2['default'], url, data).then((function (data) {
      var scopedData = options.JSONHead ? data[options.JSONHead] : data;
      if (options['successAction']) {
        _libEpDispatcher2['default'].dispatch({
          actionType: options['successAction'],
          data: scopedData
        });
      }
      if (options.onSuccess) {
        options.onSuccess.apply();
      }
      if (options.successMsg) {
        _libEpDispatcher2['default'].dispatch({
          actionType: this.specialTypes.GOT_MSG,
          data: options.successMsg
        });
      }
    }).bind(this)).fail(function (data) {
      var scopedErrors = options.JSONHead ? data[options.JSONHead] : data;
      var errors = scopedErrors ? scopedErrors.errors : data.errors;
      _libEpDispatcher2['default'].dispatch({
        actionType: errorAction,
        data: { errors: errors }
      });
    });
  }
};

exports['default'] = ActionPrototype;
module.exports = exports['default'];