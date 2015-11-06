'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var AjaxAdaptorBase = (function () {
  function AjaxAdaptorBase() {
    _classCallCheck(this, AjaxAdaptorBase);
  }

  AjaxAdaptorBase.prototype.serverBase = function serverBase() {
    return '';
  };

  //default will use the relative path

  AjaxAdaptorBase.prototype.pathRoot = function pathRoot() {
    return '/';
  };

  AjaxAdaptorBase.prototype.defaultHeaders = function defaultHeaders() {
    return {};
  };

  //any headers that should be in every ajax request
  return AjaxAdaptorBase;
})();

exports['default'] = AjaxAdaptorBase;
module.exports = exports['default'];