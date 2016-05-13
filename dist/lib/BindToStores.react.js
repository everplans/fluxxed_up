'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = bindResources;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _libContainer = require('../lib/Container');

var _libContainer2 = _interopRequireDefault(_libContainer);

var _StorePrototype = require('./StorePrototype');

var _StorePrototype2 = _interopRequireDefault(_StorePrototype);

function bindResources(Component, resources) {
  var onBoundUpdate = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
  var resourceId = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

  var stores = {};

  function capitalize(word) {
    var pascal = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    return (pascal ? word.charAt(0).toUpperCase() : word.charAt(0)) + word.slice(1).replace(/(\_\w)/g, function (match) {
      return match[1].toUpperCase();
    });
  }
  function storeNames() {
    return Object.getOwnPropertyNames(stores);
  }

  var resourceConfigs = Array.isArray(resources) ? resources : [resources]; // Handle old, one-resource pattern too.

  var bootObjects = []; // Objects containing all necessary information for firing the bootAction of each resource
  // and the tracking of the loading state of each resource.
  // Example of the bootObject for an 'item' resource:
  // {bootAction: 'fetchClient', actionClass: 'ClientActions', resourceType: 'item', resourceId: '12'}

  // Construct a bootObject for every resource:
  resourceConfigs.forEach(function (resourceConfig) {
    var resourceType = Object.getOwnPropertyNames(resourceConfig)[0];
    var resourceName = resourceConfig[resourceType];

    // Get the action class--previously registered with the Container--and action Type used to fetch the resource data:
    var actionClass = _libContainer2['default'].getAction(resourceName);
    var actionType = actionClass.Types['GOT_' + resourceName.toUpperCase()];

    // Get or create the store used to hold the resource data:
    var resourceStore = _libContainer2['default'].getStore(resourceName);
    if (!resourceStore) resourceStore = _libContainer2['default'].registerStore(resourceName, _StorePrototype2['default'](actionType));

    // Add the store to the list of store the BoundComponent will listen to:
    stores[resourceName] = resourceStore;

    bootObjects.push({
      actionClass: actionClass,
      bootAction: 'fetch' + capitalize(resourceName),
      loadingName: 'loading' + capitalize(resourceName),
      resourceId: resourceId ? resourceId : capitalize(resourceName, false) + 'Id',
      resourceType: resourceType
    });
  });

  var BoundComponent = _react2['default'].createClass({
    displayName: 'BoundComponent',

    contextTypes: { router: _react2['default'].PropTypes.object },
    getInitialState: function getInitialState() {
      return {
        loading: true,
        processing: false
      };
    },
    componentWillMount: function componentWillMount() {
      var _this = this;

      // Create a listener for each resource store:
      storeNames().forEach(function (store) {
        var onChangeHandlerName = 'handle' + store + 'Change';
        _this[onChangeHandlerName] = _this.onChangeFactory(store);
        stores[store].addChangeListener(_this[onChangeHandlerName]);
      });

      // Fire the bootAction to fetch each resource:
      var loadingStates = {};
      bootObjects.forEach(function (bootObject) {
        loadingStates[bootObject.loadingName] = true;

        /* eslint-disable indent */
        // Choose which ID--if any--is passed to the GET request to identify the resource:
        switch (bootObject.resourceType) {
          case 'item':
            // One specific item that MUST have an ID included in the GET request.
            var idParam = _this.props.params[bootObject.resourceId];
            if (!idParam) {
              // Skip bootAction for items requiring ID if no ID URL param is available.
              loadingStates[bootObject.loadingName] = false;
              break;
            }

            bootObject.actionClass[bootObject.bootAction](idParam);
            break;
          case 'itemAllParams':
            // One specific item with a more-complex API endpoint URL as constructed in the action.
            bootObject.actionClass[bootObject.bootAction](_this.props.params);
            break;
          case 'itemNoId': // Single item that requires no ID (e.g., global config). Separate from list only to make it clear that it is only one item.
          case 'list':
            // List of items accessible at a single endpoint that does not require any resource ID.
            bootObject.actionClass[bootObject.bootAction]();
            break;
          default:
            // Do not allow any resources of any other type to be requested--mainly a dev sanity check.
            _invariant2['default'](bootObject.resourceType, '`bootObject.resourceType` is unknown or undefined.');
        }
        /* eslint-enable indent */
      }, this);
      this.setState(loadingStates);
    },
    componentWillUnmount: function componentWillUnmount() {
      var _this2 = this;

      // Kill all listeners when component is unmounting.
      storeNames().forEach(function (store) {
        return stores[store].removeChangeListener(_this2['handle' + store + 'Change']);
      });
    },
    goToThere: function goToThere(targetObject) {
      // Push new router path if requested to do so in onBoundUpdate.
      this.context.router.push(targetObject);
    },

    onChangeFactory: function onChangeFactory(store) {
      var _this3 = this;

      // Create a custom listener identifier so loading states can be tracked independently for each resource.
      var myStore = store;
      return function () {
        var newState = { loading: false }; // Backwards-compatability for single-resource bindings.
        var newStoreState = stores[myStore].getState();
        newState[myStore] = newStoreState;
        newState['loading' + capitalize(store)] = false;

        // NOTE: it is the responsibility of the onBoundUpdate function to set the state if onBoundUpdate is included.
        if (onBoundUpdate && typeof onBoundUpdate === 'function') onBoundUpdate.apply(_this3, [newStoreState]);else _this3.setState(newState);
      };
    },

    render: function render() {
      return _react2['default'].createElement(Component, _extends({}, this.props, this.state));
    }
  });
  return BoundComponent;
}

module.exports = exports['default'];