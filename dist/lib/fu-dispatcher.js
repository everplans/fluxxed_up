'use strict';

var _flux = require('flux');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AppDispatcher = (0, _objectAssign2.default)(new _flux.Dispatcher(), {
  dispatch: function dispatch(action) {
    (0, _invariant2.default)(action.actionType, 'action type is undefined.');
    _flux.Dispatcher.prototype.dispatch.call(this, action);
  }
});

module.exports = AppDispatcher;