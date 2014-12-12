//this module handles all the wiring to sync form views with their underlying 
//model elements


function domId(context, name) {return '' + context['cid'] + name}
function toHTML(template, data) {
  // setup underscores template system to use ruby style interpolation aka "#{var}"
  var compiledTemplate = _.template(template, {interpolate: /\#\{(.+?)\}/g})
  return new Handlebars.SafeString(compiledTemplate(data))
}

Handlebars.registerHelper('form', function(options) {
  var html = "<form>" + options.fn(this) + "</form>"
  return toHTML(html)
});

Handlebars.registerHelper('labeled-text-field', function(fieldName, label) {
  var html = "<label class='string required control-label' for='#{domId}'>#{label}</label>"
  html += "<input class='string required form-control' value='#{value}' id='#{domId}' name='#{fieldName}' type='text' />"

  data = {
    fieldName: fieldName,
    value: this[fieldName],
    label: label,
    domId: domId(this, fieldName)}
  return toHTML(html, data)
});

Handlebars.registerHelper('labeled-checkbox', function(value, fieldName, label, domClass, style){
  var html = "<input class='#{domClass}' id='#{domId}' name='#{name}' type='checkbox' value='#{value}' style='#{style}'/>"
  html += "<label class='#{domClass}' for='#{domId}'>#{label}</label>"
  data = {
    value: value,
    name: fieldName,
    label: label,
    domClass: domClass + " " + fieldName,
    domId: domId(this, value),
    style: style
  }
  return toHTML(html, data)
});

Handlebars.registerHelper('textarea', function(fieldName, style){
  var html = "<textarea id='#{domId}' style='#{style}'>#{value}</textarea>"
  data = {
    domId: domId(this, fieldName),
    style: style,
    value: this[fieldName]
  }
  return toHTML(html, data)
});

Handlebars.registerHelper('submit-button', function(domClass, name) {
  var html = "<button class='#{domClass}' type='submit'>#{name}</button>"
  return toHTML(html, {domClass: domClass, name: name});
});

Backbone.Marionette.Renderer.render = function(template, data) {
  return HandlebarsTemplates[template](data);
}

GoodPosture.FormItemView = Backbone.Marionette.ItemView.extend({
  events: {
    "change input": "onInputChange",
    "change textarea": "onInputChange"
  },
  triggers: {
    "submit": {
      event: "processForm",
      preventDefault: true, // this param is optional and will default to true
      stopPropagation: false
    }
  },
  onInputChange: function(e) {
    var inputId = e.target.id
    if (e.target.type == "checkbox") {
        this.syncCheckboxes(e);
    } else {
      this.model.set(inputId.replace(this.cid, ""), e.target.value);
    }
    this.trigger('formChanged');
  },
  syncCheckboxes: function(e) {
    var selectName = e.target.name;
    if (e.target.value == "checkall") {
      selectName = $(e.target).attr('checks_for'); // note that this is rewritten so that the code below still updates the model
      _.each($("input[name='" + selectName + "']"), function(el) {el.checked = e.target.checked});
    }
    var selector = "input[name='" + selectName + "']:checked";
    var vals = _.map($(selector), function(elem){return elem.value})
      this.model.set(selectName,vals);
  },
  serializeData: function(){
    var attrs = this.model.attributes
    attrs.cid = this.cid
    return attrs
  },
  onDomRefresh: function(){
    if (!_.isUndefined(testDispatcher))
      testDispatcher.trigger('domUpdated');
  }
});
