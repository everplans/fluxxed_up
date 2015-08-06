var fetcher = require('../lib/jsonFetcher');
var AppDispatcher = require('../lib/ep-dispatcher');
var KeyMirror = require('keymirror');

var ActionPrototype = {
  specialTypes: KeyMirror({
    GOT_MSG: null
  }),
  fireApi: function(method, url, data, options) {
    //set default values
    var errorAction = options.errorAction ? options.errorAction : options.successAction
    fetcher[method].call(fetcher,url, data)
      .then(function(data) {
        var scopedData = options.JSONHead ? data[options.JSONHead] : data
        AppDispatcher.dispatch({
          actionType: options['successAction'],
          data: scopedData
        })
        if (options.onSuccess) {
          options.onSuccess.apply();
        }
        if (options.successMsg) {
          AppDispatcher.dispatch({
            actionType: this.specialTypes.GOT_MSG,
            data: options.successMsg
          });
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

module.exports = ActionPrototype;

