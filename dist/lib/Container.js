'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Container = function () {
  function Container() {
    _classCallCheck(this, Container);

    this.init();
  }

  _createClass(Container, [{
    key: 'init',
    value: function init() {
      this.actions = {};
      this.stores = {};
    }
  }, {
    key: 'getAction',
    value: function getAction(name) {
      return this.actions[name];
    }
  }, {
    key: 'getStore',
    value: function getStore(name) {
      return this.stores[name];
    }
  }, {
    key: 'register',
    value: function register(type, name, component) {
      this[type][name] = component;
      return component;
    }
  }, {
    key: 'registerAction',
    value: function registerAction(name, component) {
      return this.register('actions', name, component);
    }
  }, {
    key: 'registerStore',
    value: function registerStore(name, component) {
      return this.register('stores', name, component);
    }
  }]);

  return Container;
}();

exports.default = new Container();
module.exports = exports['default'];