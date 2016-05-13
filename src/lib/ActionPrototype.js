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
  stubForTests() {
    this.receivedData = {}
    const actions = Object.getOwnPropertyNames(this).filter(fn => typeof this[fn] === 'function')
    actions.forEach(action => {
      if (['fireApi', 'stubForTests', 'stubbedAction', 'saveAction', 'restore'].indexOf(action) < 0) {
        this.saveAction(action)
        this[action] = data => { this.stubbedAction(action, data) }
      }
    })
  },
  saveAction(action) { this.originalActions[action] = this[action] },
  stubbedAction(actionName, data) { this.receivedData[actionName] = data },
  restore() {
    const originals = Object.getOwnPropertyNames(this.originalActions).filter(action => typeof this.originalActions[action] === 'function')
    originals.forEach(action => { this[action] = this.originalActions[action] })
    this.originalActions = {}
  },
  fireApi(method, url, data, options) {
    // set default values
    var errorAction = options.errorAction ? options.errorAction : options.successAction
    fetcher[method](fetcher, url, data)
      .then(successData => {
        if (options.successAction) {
          AppDispatcher.dispatch({
            actionType: options.successAction,
            data: (options.JSONHead ? successData[options.JSONHead] : successData)
          })
        }
        if (options.onSuccess)
          options.onSuccess.apply()

        if (options.successMsg) {
          AppDispatcher.dispatch({
            actionType: this.specialTypes.GOT_MSG,
            data: options.successMsg
          })
        }
      }.bind(this))
      .fail(failureData => {
        var scopedErrors = options.JSONHead ? failureData[options.JSONHead] : failureData
        var errors = scopedErrors ? scopedErrors.errors : failureData.errors
        AppDispatcher.dispatch({
          actionType: errorAction,
          data: {errors}
        })
      })
  }
}

export default ActionPrototype
