import { EventEmitter } from 'events'
import assign from 'object-assign'
import AppDispatcher from './fu-dispatcher'

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
    data: {},
    errors: [],
    message: null,
    emitChange() { this.emit('CHANGE') },

    // Listeners:
    addChangeListener(callback) { this.on('CHANGE', callback) },
    removeChangeListener (callback) { this.removeListener('CHANGE', callback) },

    // Message:
    getMessage() { return this.message },
    setMessage(message) { this.message = message },

    // Errors:
    clearErrors() { this.errors = [] },
    getErrors() { return this.errors },
    hasErrors() { return (this.errors.length > 0) },
    pushError(error) { this.errors.push(error) },
    setErrors(errors) { this.errors = errors },

    // State:
    clearState() { this.setData({}) },
    getState() { return {data: this.data, errors: this.errors, message: this.message} },

    // Data:
    getData() { return this.data },
    receiveData(data) {
      if (data.errors) {
        this.setErrors(data.errors)
      } else {
        this.setData(data)
        this.clearErrors()
      }
      this.emitChange()
    },
    registerReceiveCallback(actionType) {
      return AppDispatcher.register(action => {
        if (action.actionType === actionType)
          this.receiveData(action.data)
      })
    },
    setData(data) { this.data = data },

    // Messages:
    clearFlash() {
      this.message = null
      this.emitChange()
    },
    receiveMessage(message) {
      this.setMessage(message)
      this.clearErrors()
      this.emitChange()
    },
    registerMessageCallback(actionType) {
      return AppDispatcher.register(action => {
        if (action.actionType === actionType)
          this.receiveMessage(action.data)
      })
    }
  })

  var store = Object.create(StorePrototype)
  if (registerAction)
    store.registerReceiveCallback(registerAction)
  if (extendType)
    store = assign(store, extendType)
  if (registerMessageAction)
    store.registerMessageCallback(registerMessageAction)
  return store
}

export default factory
