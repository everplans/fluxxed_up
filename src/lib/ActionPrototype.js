import fetcher from '../lib/jsonFetcher'
import AppDispatcher from '../lib/ep-dispatcher'
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
    this.recievedData = {}
    let actions = Object.getOwnPropertyNames(this).filter((fn) => { return typeof this[fn] === 'function' })
    actions.forEach((action) => {
      if (['fireApi', 'stubForTests', 'stubbedAction', 'saveAction', 'restore'].indexOf(action) < 0) {
        this.saveAction(action)
        this[action] = (data) => { this.stubbedAction(action, data) }
      }
    })
  },
  stubbedAction: function(actionName, data) {
    this.recievedData[actionName] = data
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
    fetcher[method].call(fetcher,url, data)
      .then(function(data) {
        var scopedData = options.JSONHead ? data[options.JSONHead] : data
        if (options['successAction']) {
          AppDispatcher.dispatch({
            actionType: options.successAction,
            data: scopedData
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
      .fail(function(data) {
        var scopedErrors = options.JSONHead ? data[options.JSONHead] : data
        var errors = scopedErrors ? scopedErrors.errors : data.errors
        AppDispatcher.dispatch({
          actionType: errorAction,
          data: {errors: errors}
        })
      })
  }
}

export default ActionPrototype

