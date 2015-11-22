var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../lib/dispatcher');


//this factory method will return a fully baked store. The following options are all optional

/*
 *  - registerAction - this is an action type to auto register with the app dispatcher. The callback will 
 *  be  the receiveData method.
 *
 *  - extendType - this is an object prototype which will be applied to the store. Note, only a shallow
 *  copy will occur. Use this to extend the default behavior of the store pattern.
 *
 *  - registerMessageAction - this is an action type to auto register with the app dispatcher. The callback
 *  here is the receiveMsg callback.
 *
 *  In general, 95% of functionality can be accomplished using these three. But you can still register
 *  your own callbacks, add your own methods, etc.. 

 */

var factory = function(registerAction, extendType, registerMessageAction) {
  
  var StorePrototype = assign(EventEmitter.prototype, {
  _errors: [],
  _msg: null,
  _data: {},
  emitChange: function() {
    this.emit('CHANGE');
  },
  addChangeListener: function(callback) {
    this.on('CHANGE', callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener('CHANGE', callback);
  },
  getMsg: function() {
    return this._msg;
  },
  setMsg: function(msg) {
    this._msg = msg
  },
  clearFlash: function() {
    this._msg = null;
    this.emitChange();
  },
  getErrors: function() {
    return this._errors;
  },
  pushError: function(error) {
    this._errors.push(error);
  },
  setErrors: function(errors) {
    this._errors = errors;
  },
  clearErrors: function() {
    this._errors = [];
  },
  hasErrors: function() {
    return (this._errors.length > 0)
  },
  setData: function(data) {
    this._data = data;
  },
  getData: function() {
    return this._data;
  },
  getState: function() {
    return {data: this._data, errors: this._errors, message: this._msg}
  },
  clearState: function(){
    this.setData({});
  },
  receiveData: function(data) {
    if (data.errors)
      this.setErrors(data.errors);
    else {
      this.setData(data);
      this.clearErrors();
    }
    this.emitChange();
  },
  receiveMsg: function(msg) {
    this.setMsg(msg);
    this.clearErrors();
    this.emitChange();
  },
  registerRecieveCallback: function(actionType) {
    return AppDispatcher.register(function(action) {
      if (action.actionType == actionType)
        this.receiveData(action.data);
    }.bind(this))
  },
  registerMessageCallback: function(actionType) {
    return AppDispatcher.register(function(action) {
      if (action.actionType == actionType)
        this.receiveMsg(action.data);
    }.bind(this));
  }
});

  var store = Object.create(StorePrototype);
  if (registerAction) {
    store.registerRecieveCallback(registerAction);
  }
  if (extendType) {
    store = assign(store, extendType);
  }
  if (registerMessageAction) {
    store.registerMessageCallback(registerMessageAction)
  }
  return store;
}

module.exports = factory;
