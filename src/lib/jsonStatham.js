var jQuery = (typeof $ !== 'undefined') ? $ : require('jquery') // funny little hack, sometimes it's in the global scope, sometimes it's maybe not...
import defaultAdaptor from './AjaxAdaptorBase'

function cleanSlashes(path) {
  return `${path.indexOf('/') === 0 ? '' : '/'}${path}`
}

// TODO: Success data will only be a string if a test fixture returns it, and test side effects should not dictate the
// structure of non-test code such as this. Remove this function and its invocation once this problem is fixed.
function ensureDataIsObject(data) {
  if (typeof data !== 'object')
    return JSON.parse(data)

  return data
}

var jsonStatham = {
  setAdaptor(adaptor) { this.adaptor = adaptor },
  getAdaptor() { return (this.adaptor ? this.adaptor : new defaultAdaptor()) },
  buildRequest(path, method, data, withCredentials) {
    var adaptor = this.getAdaptor()
    var opts = {
      headers: adaptor.defaultHeaders(),
      url: adaptor.serverBase() + cleanSlashes(adaptor.pathRoot()) + cleanSlashes(path)
    }
    if (method)
      opts.method = method
    if (data)
      opts.data = data
    if (withCredentials === true)
      opts.xhrFields = {withCredentials: true}
    return opts
  },
  sendRequest(request) {
    var promise = jQuery.Deferred()
    jQuery.ajax(request)
      .done((data, result, response) => { promise.resolve(ensureDataIsObject(data), response.status) })
      .fail(error => {
        var errorJSON
        if (error.responseJSON)
          errorJSON = error.responseJSON
        else if (error.responseText)
          errorJSON = JSON.parse(error.responseText)
        else
          errorJSON = {errors: ["We're sorry, an unexpected error has occurred. Please try again; our engineers have been notified."]}
        promise.reject(errorJSON)
      })

    return promise
  },
  get(url, withCredentials) { return this.sendRequest(this.buildRequest(url, 'GET', null, withCredentials)) },
  put(url, data) { return this.sendRequest(this.buildRequest(url, 'PUT', data)) },
  post(url, data, withCredentials) { return this.sendRequest(this.buildRequest(url, 'POST', data, withCredentials)) },
  delete(url, data, withCredentials) { return this.sendRequest(this.buildRequest(url, 'DELETE', data, withCredentials)) },
  postFile(url, data) {
    // Taken from: http://stackoverflow.com/questions/12431760/html5-formdata-file-upload-with-rubyonrails
    // and http://stackoverflow.com/questions/21234106/upload-file-using-reactjs-via-blueimp-fileupload-jquery-plugin
    var request = this.buildRequest(url, 'POST', data)
    request.cache = false
    request.processData = false
    request.contentType = false
    return this.sendRequest(request)
  }
}

export default jsonStatham
