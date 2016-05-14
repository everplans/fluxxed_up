import assign from 'object-assign'

export default class AjaxAdaptorBase {
  serverBase() { return '' } // default will use the relative path
  pathRoot() { return '/' }
  defaultHeaders() { return {} } // any headers that should be in every ajax request
  headers(additionalHeaders) { return assign(this.defaultHeaders(), additionalHeaders) }  // Add other headers or overwrite defaults.
}
