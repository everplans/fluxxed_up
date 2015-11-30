import fetcher from '../lib/jsonFetcher'
import AppDispatcher from '../lib/fu-dispatcher'
import KeyMirror from 'keymirror'

// TODOS:
// --turn into a class.
// --make it a factory function like we do with store prototype.

var ActionPrototype = {
  specialTypes: KeyMirror({
    GOT_MSG: null
  }),
  originalActions: {},
  stubForTests: function() {
    this.receivedData = {}
    let actions = Object.getOwnPropertyNames(this).filter((fn) => { return typeof this[fn] === 'function' })
    actions.forEach((action) => {
      if (['fireApi', 'stubForTests', 'stubbedAction', 'saveAction', 'restore'].indexOf(action) < 0) {
        this.saveAction(action)
        this[action] = (data) => { this.stubbedAction(action, data) }
      }
    })
  },
  stubbedAction: function(actionName, data) {
    this.receivedData[actionName] = data
  },
  saveAction: function(action) {
    this.originalActions[action] = this[action]
  },
  restore: function() {
    let originals = Object.getOwnPropertyNames(this.originalActions)
                          .filter((action) => { return typeof this.originalActions[action] === 'function' })
    originals.forEach((action) => { this[action] = this.originalActions[action] })
    this.originalActions = {}
  },
  fireApi: function(method, url, data, options) {
    // set default values
    var errorAction = options.errorAction ? options.errorAction : options.successAction
    fetcher[method](fetcher, url, data)
      .then(function(successData) {
        if (options.successAction) {
          AppDispatcher.dispatch({
            actionType: options.successAction,
            data: (options.JSONHead ? successData[options.JSONHead] : successData)
          })
        }
        if (options.onSuccess) {
          options.onSuccess.apply()
        }
        if (options.successMsg) {
          AppDispatcher.dispatch({
            actionType: this.specialTypes.GOT_MSG,
            data: options.successMsg
          })
        }
      }.bind(this))
      .fail(function(failureData) {
        var scopedErrors = options.JSONHead ? failureData[options.JSONHead] : failureData
        var errors = scopedErrors ? scopedErrors.errors : failureData.errors
        AppDispatcher.dispatch({
          actionType: errorAction,
          data: {errors: errors}
        })
      })
  }
}

export default ActionPrototype
