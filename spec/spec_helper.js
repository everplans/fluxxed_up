//--- Test helpers, to be moved to specific test lib
//
// Liberally stolen from Ember test helpers package: 
// https://github.com/emberjs/ember.js/blob/master/packages/ember-testing/lib/helpers.js

var callbackQueue = $.Deferred();//new Backbone.Marionette.Callbacks();
var next = callbackQueue;
var testDispatcher = _.extend({}, _.clone(Backbone.Events)); 

function start() {
  callbackQueue = $.Deferred();//new Backbone.Marionette.Callbacks();
  next = callbackQueue;
}

function finish(cb) {
  if (!_.isUndefined(cb))
    queueAction(cb);
  callbackQueue.resolve();
}

function queueAction(f) {
  next = next.then(f);
}

function findInputByLabel(label) {
  var labelSelector = "label:contains('" + label + "')"
  var inputId = "#" + $(labelSelector).attr('for')
  return $(inputId)
}
function findElByPartialSelector(selector) {
  var wildSelector = "[id$=\"" + selector + "\"]"
  return $(wildSelector)
}
function fillIn(label, value) {
  //todo throw an error if the input isn't found
  var action = function() {
    var $el = findInputByLabel(label)
    $el.val(value)
    $el.trigger('change') //trigger the backbone bound input event. 
  }
  queueAction(action);
}

function click(selector) {
  var action = function() {
    var $el = $(selector);
    $el.trigger('mousedown');
    $el.trigger('mouseup');
    // TODO - for check boxes, and other form elements set the focus. 
    $el.trigger('click');
  }
  queueAction(wrapActionInViewDeferred(action));
}

function clickButton(label) {
  var selector = "button:contains('" + label + "')";
  click(selector);
}

function clickCheck(label) {
  click("#" + $("label:contains('" + label + "')").attr('for'))
}

function visit(url) {
  var action = function() {
    TestApp.transition('/fake'); // need to extract app dependency out of this
    TestApp.transition(url);
  }
  queueAction(wrapActionInViewDeferred(action));
}

function wrapActionInViewDeferred(action) {
  return function() {
    var _def = Backbone.Marionette.Deferred();
    testDispatcher.once('domUpdated', function(){
      _def.resolve();
    });
    action();
    return _def.promise();
  }
}

function bootstrapBackbone() {
  TestApp.addRegions({'mainRegion': '#testRunner'}) //attach to the fixture dom...
}

function waitFor(selector) {
  var _def = Backbone.Marionette.Deferred();
  var _action = function() {
    return def.promise()

    var _watcher = setInterval(function() {
      if ($(selector).length > 0) {
        def.resolve();
        clearInterval(_watcher)
      }
    }, 50);
    setInterval(function() {clearInterval(_watcher)}, 1500);
    return _def.promise()
  }
  queueAction(function(){_action});
}

function bodyTextSelector(text) {
  return "body:contains('" + text + "')" ;
}

function waitForText(text) {
  return waitFor(bodyTextSelector(text));
}

//-------- test specific helpers



//---- Disable transitions for tests, so the DOM is immeidately changed, 
//---- Lessons likelyhood of non-determinisitic test side effects. 
/*Marionette.Region.prototype.attachHtml = function(view){
  this.$el.hide();
  this.$el.html(view.el);
  this.$el.show();
}
*/


