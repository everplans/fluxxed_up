'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// funny little hack, sometimes it's in the global scope, sometimes it's maybe not...

var _extra_storage = require('./extra_storage');

var _extra_storage2 = _interopRequireDefault(_extra_storage);

var _AjaxAdaptorBase = require('./AjaxAdaptorBase');

var _AjaxAdaptorBase2 = _interopRequireDefault(_AjaxAdaptorBase);

var jQuery = typeof $ !== 'undefined' ? $ : require('jquery');

var _cleanSlashes = function _cleanSlashes(path) {
  if (path.indexOf("/") === 0) return path;else return "/" + path;
};

var fetcher = {
  setAdaptor: function setAdaptor(adaptor) {
    this.adaptor = adaptor;
  },
  getAdaptor: function getAdaptor() {
    return this.adaptor ? this.adaptor : new _AjaxAdaptorBase2['default']();
  },
  buildRequest: function buildRequest(path, method, data, withCredentials) {
    var headers = {}; //TODO grab special header
    var adaptor = this.getAdaptor();
    var opts = {
      url: adaptor.serverBase() + _cleanSlashes(adaptor.pathRoot()) + _cleanSlashes(path)
    };
    if (method) opts.method = method;
    if (data) opts.data = data;
    if (withCredentials === true) opts.xhrFields = { withCredentials: true };
    opts.headers = headers;
    return opts;
  },
  sendRequest: function sendRequest(request) {
    var promise = jQuery.Deferred();
    jQuery.ajax(request).done(function (data, result, response) {
      if (typeof data != "object") data = JSON.parse(data); // this would only be a string if a test fixture returns it -- would love to not have test side effects here -BJK
      promise.resolve(data, response.status);
    }).fail(function (err) {
      var errorJSON;
      if (err.responseJSON) errorJSON = err.responseJSON;else if (err.responseText) errorJSON = JSON.parse(err.responseText);else errorJSON = { errors: ["We're sorry, an unexpected error has occurred. Please try again; our engineers have been notified."] };
      promise.reject(errorJSON);
    });

    return promise;
  },
  fetch: function fetch(url) {
    //temporary backwards compatibility
    return this.get(url);
  },
  get: function get(url, withCredentials) {
    return this.sendRequest(this.buildRequest(url, 'GET', null, withCredentials));
  },
  put: function put(url, data) {
    return this.sendRequest(this.buildRequest(url, 'PUT', data));
  },
  post: function post(url, data, withCredentials) {
    return this.sendRequest(this.buildRequest(url, 'POST', data, withCredentials));
  },
  'delete': function _delete(url, data, withCredentials) {
    return this.sendRequest(this.buildRequest(url, 'DELETE', data, withCredentials));
  },
  postFile: function postFile(url, data) {
    //taken from: http://stackoverflow.com/questions/12431760/html5-formdata-file-upload-with-rubyonrails
    //and http://stackoverflow.com/questions/21234106/upload-file-using-reactjs-via-blueimp-fileupload-jquery-plugin
    var request = this.buildRequest(url, 'POST', data);
    request.cache = false;
    request.processData = false;
    request.contentType = false;
    return this.sendRequest(request);
  },
  parseError: function parseError(err) {
    if (err.error) return err.error.message;else return "There was an unexpected error. Please try again. If the error persists, please contact your account representative.";
  }
};

exports['default'] = fetcher;
module.exports = exports['default'];