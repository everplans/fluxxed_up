import ActionPrototype from '../../src/lib/ActionPrototype'
import StorePrototype from '../../src/lib/StorePrototype'
import Dispatcher from '../../src/lib/ep-dispatcher'
import assign from 'object-assign'
import KeyMirror from 'keymirror'


var TestAction = assign(ActionPrototype, {
  Types: KeyMirror({
    GOT_THING: null
  }),
  fetchThing: function() {
    //actually fire API 
    Dispatcher.dispatch({
      actionType: TestAction.Types.GOT_THING,
      data: {foo: 'bar'}
    })
  }
})

var TestStore = StorePrototype(TestAction.Types.GOT_THING)

var fuHelpers = function (chai, utils) {
  var Assertion = chai.Assertion;

  Assertion.addMethod('informRegisteredStore', function(store) {
    var action = this._obj;
    var mockPayload = {foo: 'bar'}
    var callbackAlreadyFired = false
    //possibly stub jsonFetcher

    var callback = function() {
      callbackAlreadyFired = true
      store.removeChangeListener(callback)
      this.assert(
        store.getData().foo === mockPayload.foo, //make sure we've heard from 
        "expected #{this} to dispatch a payload to #{store}",
        "expected #{this} not to dispatch a payload to #{storeName}"
      )
    }.bind(this)

    //register listener with the store
    store.addChangeListener(callback)

    //fire the action
    action()

    //possibly some kind of timeout loop to fail if the timeout didn't happen

    //store the output

    //no matter what unregister

    //fire the assertion synchronously

  });
};

chai.use(fuHelpers)


describe("Test Action", function() {

  beforeEach(function() {
    //featureFlags.init(flags);
    //some stuff
  })

  it("dispatches to test store", function() {
    expect(TestAction.fetchThing).to.informRegisteredStore(TestStore)
  })
})