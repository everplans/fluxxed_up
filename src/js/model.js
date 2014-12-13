Backwax.Model = Backbone.Model.extend({
  //TODO, override constructor so that defaults specified down chain get merged in
  defaults: { errors: [],
    hasErrors: false,
    isLoading: true
  },
  blacklistAttributes: function(blacklist) {
    return this.omit(_.union(['cid', 'hasErrors', 'errors', 'isLoading'], blacklist))
  },
  prepareForm: function(head, blacklist) {
    var formObj = {};
    formObj[head] = this.toRailsJSON(this.blacklistAttributes(blacklist));
    return formObj;
  },
  toRailsJSON: function(vals) {
    var _this = this
    var rubyAttributes = {}
    _.each(_.keys(vals), function(key){
      rubyAttributes[_this.toCamelCase(key)] = vals[key]
    })
    return rubyAttributes
  },
  toCamelCase: function (val) {
    return val.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();})
  },
  sendForm: function(path, JSONhead, blacklist) {
    var _this = this
    var promise = new RSVP.Promise(function(resolve, reject) {
      var formData = _this.prepareForm(JSONhead, blacklist)
      $.post(path, formData, handler)
      function handler (data) {
        if (_.isString(data)) {data = JSON.parse(data)} //shouldn't need this but test fixtures sometimes return data as string

        if (data['valid'] == true) {
          _this.set('hasErrors', false)
          resolve(_this)
        } else {
          _this.set('hasErrors', true)
          _this.set('errors', data['errors'])
          reject(_this)
        }
      }
    })
    return promise
  },
});

