'use strict';

exports.__esModule = true;

exports['default'] = function (chai, utils) {
  var Assertion = chai.Assertion;

  // Use Chai flags to hold on to the done callback:
  function flagDoneCallback(done) {
    utils.flag(this, 'done', done);
  }

  Assertion.addChainableMethod('eventually', flagDoneCallback);

  Assertion.addMethod('informRegisteredStore', function (store) {
    var action = this._obj;
    var mockPayload = { foo: 'bar' };
    var callbackAlreadyFired = false;
    var done = utils.flag(this, 'done');
    var ctx = this;

    // TODO: Possibly stub jsonFetcher.

    // Freak out if there is no done callback:
    var needCallback = new Assertion();
    needCallback.assert(typeof done === 'function', "expected done callback to be specified. Use 'eventually(done)' in the expect chain.");

    // If the action does not dispatch the expected action type, the store will never fire its callback, and the test
    // assertion will technically never fire. This can result in a false positive since there is no assertion, and
    // therefore the test never reports a failure. To prevent this we wait a quick interval and fire the resolve
    // function anyway. This forces the test to 'fail' if there is no data coming from the store.
    setTimeout(function () {
      resolve();
    }, 100);

    function callback() {
      resolve(store.getData());
    }

    // Register listener with the store:
    store.addChangeListener(callback);

    function resolve(data) {
      if (callbackAlreadyFired) return;

      // Do cleanup before any assertions to ensure it happens:
      callbackAlreadyFired = true;
      store.removeChangeListener(callback);

      // This will fail if the store never got data from the action:
      var assertStoreData = new Assertion(data, 'action dispatch talks to store (Either action never dispatched, or store is listening for the wrong action)');
      utils.transferFlags(ctx, assertStoreData, false);
      assertStoreData.to.be.ok;

      if (data) {
        ctx.assert(data.foo === mockPayload.foo, // Make sure we've heard from the store
        'expected #{this} to dispatch a payload to #{exp}', 'expected #{this} not to dispatch a payload to #{exp}');
      }
      done();
    }

    // Fire the action:
    action();
  });
};

module.exports = exports['default'];