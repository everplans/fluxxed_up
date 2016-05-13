import keyMirror from 'keymirror'

import ActionPrototype from './ActionPrototype'
import AppDispatcher from './fu-dispatcher'

export default class ActionFactory {
  // Take an array of strings which are converted to action Types via keyMirror:
  constructor(actionTypes) {
    this.Types = keyMirror(actionTypes.reduce((previous, keyName) => {
      previous[keyName] = null
      return previous
    }, {}))
    Object.assign(this, ActionPrototype) // TODO: make all actions use this class and won't need the prototype
  }
  buildAction(name, method, url, options) {
    this[name] = data => this.fireApi(method, url, data, options)
  }
  // Build an action function that just dispatches a Type with the passed data payload:
  buildActionDispatch(name, type) {
    this[name] = data => AppDispatcher.dispatch({actionType: type, data})
  }
}
