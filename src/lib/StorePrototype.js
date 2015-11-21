import { EventEmitter } from 'events'
import assign from 'object-assign'
import AppDispatcher from '../lib/ep-dispatcher'

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
  var StorePrototype = assign(EventEmitter.prototype, {
    errors: [],
    message: null,
    data: {},
    emitChange: function() {
      this.emit('CHANGE')
    },
    addChangeListener: function(callback) {
      this.on('CHANGE', callback)
    },
    removeChangeListener: function (callback) {
      this.removeListener('CHANGE', callback)
    },
    getMessage: function() {
      return this.message
    },
    setMessage: function(message) {
      this.message = message
    },
    clearFlash: function() {
      this.message = null
      this.emitChange()
    },
    getErrors: function() {
      return this.errors
    },
    pushError: function(error) {
      this.errors.push(error)
    },
    setErrors: function(errors) {
      this.errors = errors
    },
    clearErrors: function() {
      this.errors = []
    },
    hasErrors: function() {
      return (this.errors.length > 0)
    },
    setData: function(data) {
      this.data = data
    },
    getData: function() {
      return this.data
    },
    getState: function() {
      return {data: this.data, errors: this.errors, message: this.message}
    },
    clearState: function() {
      this.setData({})
    },
    receiveData: function(data) {
      if (data.errors)
        this.setErrors(data.errors)
      else {
        this.setData(data)
        this.clearErrors()
      }
      this.emitChange()
    },
    receiveMessage: function(message) {
      this.setMessage(message)
      this.clearErrors()
      this.emitChange()
    },
    registerRecieveCallback: function(actionType) {
      return AppDispatcher.register(function(action) {
        if (action.actionType === actionType)
          this.receiveData(action.data)
      }.bind(this))
    },
    registerMessageCallback: function(actionType) {
      return AppDispatcher.register(function(action) {
        if (action.actionType === actionType)
          this.receiveMessage(action.data)
      }.bind(this))
    }
  })

  var store = Object.create(StorePrototype)
  if (registerAction)
    store.registerRecieveCallback(registerAction)
  if (extendType)
    store = assign(store, extendType)
  if (registerMessageAction)
    store.registerMessageCallback(registerMessageAction)
  return store
}

module.exports = factory
