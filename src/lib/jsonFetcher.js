var jQuery = (typeof $ !== 'undefined') ? $ : require('jquery') // funny little hack, sometimes it's in the global scope, sometimes it's maybe not...
import extra_storage from './extra_storage'
import defaultAdaptor from './AjaxAdaptorBase';

var _cleanSlashes = function(path) {
  if (path.indexOf("/") === 0)
    return path;
  else
    return "/" + path;
}

var fetcher = {
  setAdaptor: function(adaptor) {
    this.adaptor = adaptor
  },
  getAdaptor: function() {
    return (this.adaptor) ? this.adaptor : new defaultAdaptor();
  },
  buildRequest: function(path, method, data, withCredentials) {
    var headers= { } //TODO grab special header
    var adaptor = this.getAdaptor();
    var opts = {
      url: adaptor.serverBase() + _cleanSlashes(adaptor.pathRoot()) + _cleanSlashes(path)
    }
    if (method)
      opts.method = method;
    if (data)
      opts.data = data;
    if (withCredentials === true)
      opts.xhrFields= {withCredentials: true} ;
    opts.headers = headers;
    return opts;
  },
  sendRequest: function(request) {
    var promise = jQuery.Deferred();
    jQuery.ajax(request)
      .done(function (data, result, response){
        if (typeof(data) != "object")
          data = JSON.parse(data); // this would only be a string if a test fixture returns it -- would love to not have test side effects here -BJK
        promise.resolve(data, response.status);
      }).fail(function(err) {
        var errorJSON;
        if (err.responseJSON)
          errorJSON = err.responseJSON;
        else if (err.responseText)
          errorJSON = JSON.parse(err.responseText);
        else
          errorJSON = {errors: ["We're sorry, an unexpected error has occurred. Please try again; our engineers have been notified."]};
        promise.reject(errorJSON);
      });

    return promise;
  },
  fetch: function(url) { //temporary backwards compatibility
    return this.get(url);
  },
  get: function(url, withCredentials) {
    return this.sendRequest(this.buildRequest(url, 'GET', null, withCredentials));
  },
  put: function(url, data) {
    return this.sendRequest(this.buildRequest(url, 'PUT', data));
  },
  post: function(url, data, withCredentials) {
    return this.sendRequest(this.buildRequest(url, 'POST', data, withCredentials));
  },
  delete: function(url, data, withCredentials){
    return this.sendRequest(this.buildRequest(url, 'DELETE', data, withCredentials));
  },
  postFile: function(url, data) {
    //taken from: http://stackoverflow.com/questions/12431760/html5-formdata-file-upload-with-rubyonrails
    //and http://stackoverflow.com/questions/21234106/upload-file-using-reactjs-via-blueimp-fileupload-jquery-plugin
    var request = this.buildRequest(url, 'POST', data);
    request.cache = false
    request.processData = false
    request.contentType = false
    return this.sendRequest(request);
  },
  parseError: function(err) {
    if(err.error)
      return err.error.message
    else
      return "There was an unexpected error. Please try again. If the error persists, please contact your account representative."
  }
};

export default fetcher;