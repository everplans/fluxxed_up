import keyMirror from 'keymirror'

import ActionPrototype from './ActionPrototype'
import AppDispatcher from './fu-dispatcher'

export default class ActionFactory {
  // takes an array of strings which become action Types, via KeyMirror
  constructor(actionTypes) {
    this.Types = keyMirror(actionTypes.reduce((previous, keyName) => {
      previous[keyName] = null
      return previous
    }, {}))
    Object.assign(this, ActionPrototype) // eventually we'll make all actions use this class and we don't need the prototype
  }

  buildAction(name, method, url, options) {
    this[name] = data => this.fireApi(method, url, data, options)
  }
  // builds an action function that just dispatches a type with a passed data payload
  buildActionDispatch(name, type) {
    this[name] = data => AppDispatcher.dispatch({actionType: type, data})
  }

}
