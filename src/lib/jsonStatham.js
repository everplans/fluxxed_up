var jQuery = (typeof $ !== 'undefined') ? $ : require('jquery') // funny little hack, sometimes it's in the global scope, sometimes it's maybe not...
import assign from 'object-assign'
import defaultAdaptor from './AjaxAdaptorBase'

function cleanSlashes(path) {
  return `${path.indexOf('/') === 0 ? '' : '/'}${path}`
}

const defaultConfig = {
  additionalHeaders: {},
  stringify: true
}

// TODO: Success data will only be a string if a test fixture returns it, and test side effects should not dictate the
// structure of non-test code such as this. Remove this function and its invocation once this problem is fixed.
const isNotWhitespaceString = data => !(typeof data === 'string' && data.trim().length === 0)

function ensureDataIsObject(data) {
  if (typeof data !== 'object' && isNotWhitespaceString(data))
    return JSON.parse(data)

  return data
}

var jsonStatham = {
  setAdaptor(adaptor) { this.adaptor = adaptor },
  getAdaptor() { return (this.adaptor ? this.adaptor : new defaultAdaptor()) },
  buildRequest(path, method, data, config = defaultConfig) {
    var adaptor = this.getAdaptor()
    var opts = {
      // Default to JSON content, but allow default or additional headers to override this:
      headers: assign({'Content-Type': 'application/json'}, adaptor.defaultHeaders(), config.additionalHeaders),
      url: adaptor.serverBase() + cleanSlashes(adaptor.pathRoot()) + cleanSlashes(path)
    }
    if (method)
      opts.method = method

    // Stringify data if it exists, is JSON, and config doesn't say not to stringify; pass it along as-is otherwise.
    if (data)
      opts.data = (opts.headers['Content-Type'] === 'application/json' && config.stringify !== false) ? JSON.stringify(data) : data
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
        promise.reject(errorJSON, error.status)
      })

    return promise
  },
  get(url) { return this.sendRequest(this.buildRequest(url, 'GET', null)) },
  put(url, data) { return this.sendRequest(this.buildRequest(url, 'PUT', data)) },
  post(url, data) { return this.sendRequest(this.buildRequest(url, 'POST', data)) },
  delete(url, data) { return this.sendRequest(this.buildRequest(url, 'DELETE', data)) },
  postFile(url, data) {
    // Taken from: http://stackoverflow.com/questions/12431760/html5-formdata-file-upload-with-rubyonrails
    // and http://stackoverflow.com/questions/21234106/upload-file-using-reactjs-via-blueimp-fileupload-jquery-plugin
    var request = this.buildRequest(url, 'POST', data, {stringify: false})

    // This header must be deleted so the server doesn't get angry that it is receiving multipart/form-data instead.
    // Setting it to multipart/form-data does not work because it does not contain the boundary, which is required.
    delete request.headers['Content-Type']
    request.cache = false
    request.processData = false
    request.contentType = false
    return this.sendRequest(request)
  }
}

export default jsonStatham
