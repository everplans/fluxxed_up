'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = bindResources;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _StorePrototype = require('./StorePrototype');

var _StorePrototype2 = _interopRequireDefault(_StorePrototype);

// let's say for now, stores is a dictionary of name and object

function bindResources(Component, resourceName) {
  function extractStores() {
    return Object.getOwnPropertyNames(stores).map(function (store) {
      return stores[store];
    });
  }
  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  function singularize(word) {
    return word.slice(-1) === 's' ? word.slice(0, -1) : word;
  }

  var bootAction = 'fetch' + capitalize(resourceName);

  // figure out how to pass in actions
  // import actionClass from `PATH TO ACTIONS/${singularize(capitalize(resourceName))}Actions`

  var actionType = actionClass.Types['GOT_' + resourceName.toUpperCase()];
  var resourceStore = _StorePrototype2['default'](actionType);
  var stores = {};
  stores[resourceName] = resourceStore;

  var BoundComponent = _react2['default'].createClass({
    displayName: 'BoundComponent',

    getInitialState: function getInitialState() {
      return { loading: true, processing: false };
    },
    componentWillMount: function componentWillMount() {
      var _this = this;

      extractStores().forEach(function (store) {
        return store.addChangeListener(_this.handleStoresChanged);
      });
      actionClass[bootAction]();
    },
    componentWillUnmount: function componentWillUnmount() {
      var _this2 = this;

      extractStores().forEach(function (store) {
        return store.removeChangeListener(_this2.handleStoresChanged);
      });
    },
    handleStoresChanged: function handleStoresChanged() {
      var state = { processing: false, loading: false };
      Object.getOwnPropertyNames(stores).map(function (store) {
        state[store] = stores[store].getState();
      });
      this.setState(state);
    },
    render: function render() {
      return _react2['default'].createElement(Component, _extends({}, this.props, this.state));
    }
  });
  return BoundComponent;
}

module.exports = exports['default'];