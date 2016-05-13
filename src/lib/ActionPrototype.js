var fetcher = require('../lib/jsonFetcher');
var AppDispatcher = require('../lib/ep-dispatcher');
var KeyMirror = require('keymirror');

var ActionPrototype = {
  specialTypes: KeyMirror({
    GOT_MSG: null
  }),
  originalActions: {},
  stubForTests: function() {
    this.receivedData = {}
    let actions = Object.getOwnPropertyNames(this).filter( (fn)=> {return typeof this[fn] === 'function' } )
    actions.forEach( (action)=> {
      if (['fireApi', 'stubForTests', 'stubbedAction', 'saveAction', 'restore'].indexOf(action) < 0) {
        this.saveAction(action)
        this[action]=(data)=> {this.stubbedAction(action, data)}
      }
    })
  },
  stubbedAction: function(actionName, data) {
    this.receivedData[actionName] = data
  },
  saveAction: function(action) {
    this.originalActions[action] = this[action]
  },
  restore: function() {
    let orignals = Object.getOwnPropertyNames(this.originalActions).filter((fn)=>{ return typeof this.originalActions[fn] === 'function'})
    orignals.forEach((fn)=>{this[fn] = this.originalActions[fn]})
    this.originalActions = {}
  },
  fireApi: function(method, url, data, options) {
    //set default values
    var errorAction = options.errorAction ? options.errorAction : options.successAction
    fetcher[method].call(fetcher,url, data)
      .then(function(data) {
        var scopedData = options.JSONHead ? data[options.JSONHead] : data
        if (options['successAction']) {
          AppDispatcher.dispatch({
            actionType: options['successAction'],
            data: scopedData
          })
        }
        if (options.onSuccess) {
          options.onSuccess.apply(null, [scopedData])
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
