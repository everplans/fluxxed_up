'use strict';

var _events = require('events');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _fuDispatcher = require('../lib/fu-dispatcher');

var _fuDispatcher2 = _interopRequireDefault(_fuDispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This factory method will return a fully-baked store. The following options are all optional:
// * registerAction: this is an action type to auto-register with the app dispatcher. The callback will be the
//                   receiveData method.
// * extendType: this is an object prototype which will be applied to the store. Note, only a shallow copy will
//               occur. Use this to extend the default behavior of the store pattern.
// * registerMessageAction: this is an action type to auto register with the app dispatcher. The callback here is
//                          the receiveMessage callback.
// *
// In general, 95% of functionality can be accomplished using these three options, but you can still register your own
// callbacks, add your own methods, etc...

function factory(registerAction, extendType, registerMessageAction) {
  var StorePrototype = (0, _objectAssign2.default)(_events.EventEmitter.prototype, {
    errors: [],
    message: null,
    data: {},
    emitChange: function emitChange() {
      this.emit('CHANGE');
    },
    addChangeListener: function addChangeListener(callback) {
      this.on('CHANGE', callback);
    },
    removeChangeListener: function removeChangeListener(callback) {
      this.removeListener('CHANGE', callback);
    },
    getMessage: function getMessage() {
      return this.message;
    },
    setMessage: function setMessage(message) {
      this.message = message;
    },
    clearFlash: function clearFlash() {
      this.message = null;
      this.emitChange();
    },
    getErrors: function getErrors() {
      return this.errors;
    },
    pushError: function pushError(error) {
      this.errors.push(error);
    },
    setErrors: function setErrors(errors) {
      this.errors = errors;
    },
    clearErrors: function clearErrors() {
      this.errors = [];
    },
    hasErrors: function hasErrors() {
      return this.errors.length > 0;
    },
    setData: function setData(data) {
      this.data = data;
    },
    getData: function getData() {
      return this.data;
    },
    getState: function getState() {
      return { data: this.data, errors: this.errors, message: this.message };
    },
    clearState: function clearState() {
      this.setData({});
    },
    receiveData: function receiveData(data) {
      if (data.errors) this.setErrors(data.errors);else {
        this.setData(data);
        this.clearErrors();
      }
      this.emitChange();
    },
    receiveMessage: function receiveMessage(message) {
      this.setMessage(message);
      this.clearErrors();
      this.emitChange();
    },
    registerReceiveCallback: function registerReceiveCallback(actionType) {
      return _fuDispatcher2.default.register(function (action) {
        if (action.actionType === actionType) this.receiveData(action.data);
      }.bind(this));
    },
    registerMessageCallback: function registerMessageCallback(actionType) {
      return _fuDispatcher2.default.register(function (action) {
        if (action.actionType === actionType) this.receiveMessage(action.data);
      }.bind(this));
    }
  });

  var store = Object.create(StorePrototype);
  if (registerAction) store.registerReceiveCallback(registerAction);
  if (extendType) store = (0, _objectAssign2.default)(store, extendType);
  if (registerMessageAction) store.registerMessageCallback(registerMessageAction);
  return store;
}

module.exports = factory;