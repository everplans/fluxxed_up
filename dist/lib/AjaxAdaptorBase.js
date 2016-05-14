'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AjaxAdaptorBase = function () {
  function AjaxAdaptorBase() {
    _classCallCheck(this, AjaxAdaptorBase);
  }

  _createClass(AjaxAdaptorBase, [{
    key: 'serverBase',
    value: function serverBase() {
      return '';
    } // default will use the relative path

  }, {
    key: 'pathRoot',
    value: function pathRoot() {
      return '/';
    }
  }, {
    key: 'defaultHeaders',
    value: function defaultHeaders() {
      return {};
    } // any headers that should be in every ajax request

  }]);

  return AjaxAdaptorBase;
}();

exports.default = AjaxAdaptorBase;
module.exports = exports['default'];