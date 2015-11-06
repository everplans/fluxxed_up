'use strict';

var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');
var invariant = require('invariant');

var AppDispatcher = assign(new Dispatcher(), {
  dispatch: function dispatch(action) {
    invariant(action.actionType, 'action type is undefined.');
    Dispatcher.prototype.dispatch.call(this, action);
  }
});
module.exports = AppDispatcher;