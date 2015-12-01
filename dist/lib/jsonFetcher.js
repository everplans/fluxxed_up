'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// funny little hack, sometimes it's in the global scope, sometimes it's maybe not...

var _AjaxAdaptorBase = require('./AjaxAdaptorBase');

var _AjaxAdaptorBase2 = _interopRequireDefault(_AjaxAdaptorBase);

var jQuery = typeof $ !== 'undefined' ? $ : require('jquery');

function cleanSlashes(path) {
  return '' + (path.indexOf('/') === 0 ? '' : '/') + path;
}

// TODO: Success data will only be a string if a test fixture returns it, and test side effects should not dictate the
// structure of non-test code such as this. Remove this function and its invocation once this problem is fixed.
function ensureDataIsObject(data) {
  if (typeof data !== 'object') return JSON.parse(data);

  return data;
}

var fetcher = {
  setAdaptor: function setAdaptor(adaptor) {
    this.adaptor = adaptor;
  },
  getAdaptor: function getAdaptor() {
    return this.adaptor ? this.adaptor : new _AjaxAdaptorBase2['default']();
  },
  buildRequest: function buildRequest(path, method, data, withCredentials) {
    var headers = {}; // TODO grab special header
    var adaptor = this.getAdaptor();
    var opts = {
      headers: headers,
      url: adaptor.serverBase() + cleanSlashes(adaptor.pathRoot()) + cleanSlashes(path)
    };
    if (method) opts.method = method;
    if (data) opts.data = data;
    if (withCredentials === true) opts.xhrFields = { withCredentials: true };
    return opts;
  },
  sendRequest: function sendRequest(request) {
    var promise = jQuery.Deferred();
    jQuery.ajax(request).done(function (data, result, response) {
      promise.resolve(ensureDataIsObject(data), response.status);
    }).fail(function (error) {
      var errorJSON;
      if (error.responseJSON) errorJSON = error.responseJSON;else if (error.responseText) errorJSON = JSON.parse(error.responseText);else errorJSON = { errors: ["We're sorry, an unexpected error has occurred. Please try again; our engineers have been notified."] };
      promise.reject(errorJSON);
    });

    return promise;
  },
  fetch: function fetch(url) {
    // temporary backwards compatibility
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
    // Taken from: http://stackoverflow.com/questions/12431760/html5-formdata-file-upload-with-rubyonrails
    // and http://stackoverflow.com/questions/21234106/upload-file-using-reactjs-via-blueimp-fileupload-jquery-plugin
    var request = this.buildRequest(url, 'POST', data);
    request.cache = false;
    request.processData = false;
    request.contentType = false;
    return this.sendRequest(request);
  }
};

exports['default'] = fetcher;
module.exports = exports['default'];