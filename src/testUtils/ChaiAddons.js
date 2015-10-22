export default function (chai, utils) {
  var Assertion = chai.Assertion;

  //uses Chai flags to hold on to the done callback
  function flagDoneCallback(done) {
    utils.flag(this, 'done', done)
  }

  Assertion.addChainableMethod('eventually', flagDoneCallback)

  Assertion.addMethod('informRegisteredStore', function(store) {
    var action = this._obj;
    var mockPayload = {foo: 'bar'}
    var callbackAlreadyFired = false
    var done = utils.flag(this, 'done')
    var ctx = this

    //possibly stub jsonFetcher

    //freak out if there is no done callback
    new Assertion().assert(typeof done === "function", "expected done callback to be specified. Use 'eventually(done)' in the expect chain.")

    //if the action does not dispatch the expected action type, the store will never fire its callback (and the test assertion will technically never fire)
    //this can result in a false positive, since there is no assertion, and the test never reports a failure. Wait a quick interval, and fire the resolve
    //function anyway. The test will "fail", if there is no data coming from the store. 
    setTimeout(() => { resolve() }, 100);

    var callback = function() {
      resolve(store.getData())
    }

    //register listener with the store
    store.addChangeListener(callback)

    function resolve(data) {
      if (callbackAlreadyFired)
        return;

      //do cleanup before any assertions to ensure it happens
      callbackAlreadyFired = true;
      store.removeChangeListener(callback)

      //this will fail if the store never got data from the action
      var assertStoreData = new Assertion(data, "action dispatch talks to store (Either action never dispatched, or store is listening for the wrong action)")
      utils.transferFlags(ctx, assertStoreData, false);
      assertStoreData.to.be.ok

      if (data) {
        ctx.assert(
          data.foo === mockPayload.foo, //make sure we've heard from 
          "expected #{this} to dispatch a payload to #{exp}",
          "expected #{this} not to dispatch a payload to #{exp}"
        )
      }
      done()
    }

    //fire the action
    action()
  });
};