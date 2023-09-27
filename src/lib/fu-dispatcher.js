import { Dispatcher } from 'flux'
import assign from 'object-assign'
import invariant from 'invariant'

var AppDispatcher = assign(new Dispatcher(), {
  dispatch(action) {
    invariant(action.actionType, 'action type is undefined.')
    Dispatcher.prototype.dispatch.call(this, action)
  }
})

export default AppDispatcher
