'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Container = (function () {
  function Container() {
    _classCallCheck(this, Container);

    this.init();
  }

  Container.prototype.init = function init() {
    this.actions = {};
    this.stores = {};
  };

  Container.prototype.getAction = function getAction(name) {
    return this.actions[name];
  };

  Container.prototype.getStore = function getStore(name) {
    return this.stores[name];
  };

  Container.prototype.register = function register(type, name, component) {
    this[type][name] = component;
    return component;
  };

  Container.prototype.registerAction = function registerAction(name, component) {
    return this.register('actions', name, component);
  };

  Container.prototype.registerStore = function registerStore(name, component) {
    return this.register('stores', name, component);
  };

  return Container;
})();

exports['default'] = new Container();
module.exports = exports['default'];