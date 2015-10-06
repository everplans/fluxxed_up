import ActionPrototype from '../../src/lib/ActionPrototype'
import StorePrototype from '../../src/lib/StorePrototype'
import Dispatcher from '../../src/lib/ep-dispatcher'
import assign from 'object-assign'
import KeyMirror from 'keymirror'


var TestAction = assign(ActionPrototype, {
  Types: KeyMirror({
    GOT_THING: null,
    NOTHING: null
  }),
  fetchThing: function() {
    //actually fire API 
    Dispatcher.dispatch({
      actionType: TestAction.Types.GOT_THING,
      data: {foo: 'bar'}
    })

  },
  fetchWithWrongDispatch: function() {
    Dispatcher.dispatch({
      actionType: TestAction.Types.NOTHING,
      data: {foo: 'bar'}
    })
  }
})

var TestStore = StorePrototype(TestAction.Types.GOT_THING)

describe("Test Action", function() {
  it("dispatches to test store", function(done) {
    expect(TestAction.fetchThing).to.eventually(done).informRegisteredStore(TestStore)
  })

  it("wrong action will not notify the store", function(done) {
    expect(TestAction.fetchWithWrongDispatch).to.not.eventually(done).informRegisteredStore(TestStore)
  })
})