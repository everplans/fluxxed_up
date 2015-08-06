var AppDispatcher = require('../../src/lib/ep-dispatcher');
var KeyMirror = require('keymirror');
var Invariant = require('invariant');

describe("AppDispatcher", function() {
  var callback;
  var TestAction = {
    Types: KeyMirror({
      DEFINED_ACTION_TYPE: null
    })
  }

  afterEach(function() {
    if (callback)
      AppDispatcher.unregister(callback);
    callback = null;
  });

  it("dispatches an action type", function(done) {
    var dispatcherCallback = function(action) {
      expect(action.actionType).to.equal(TestAction.Types.DEFINED_ACTION_TYPE);
      done();
    }
    callback = AppDispatcher.register(dispatcherCallback);
    AppDispatcher.dispatch({actionType: TestAction.Types.DEFINED_ACTION_TYPE});
  });

  it("dispatches an action with a data payload", function(done) {
    var dispatcherCallback = function(action) {
      expect(action.data.foo).to.equal('bar');
      done();
    }
    callback = AppDispatcher.register(dispatcherCallback);
    AppDispatcher.dispatch({actionType: TestAction.Types.DEFINED_ACTION_TYPE, data: {'foo': 'bar'}});
  });


  it("throws invariant when action type is undefined", function() {
    var callback = AppDispatcher.register(function() {});
    expect(function() {
      AppDispatcher.dispatch({actionType: TestAction.Types.UNDEFINED_ACTION_TYPE})
    }).to.throw(/action type is undefined./);
  });

});