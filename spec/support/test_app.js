window.TestApp = new Backbone.Marionette.Application();

//find some way to not have global models...
//TestApp.TestModel = GoodPosture.Model.extend({});

var model = new GoodPosture.Model()

TestApp.FormView = GoodPosture.FormItemView.extend({
  initialize: function() {
    var _this = this
    this.on('processForm', function() {
      //this.model.validateDeputyInfo().then( function(model) {
        TestApp.transition('test/Success');
      //}, function(model) {
        //Everplans.mainRegion.currentView.render()
        //model already updated with errors, just re-render screen to see them
      //});
    });
  },
  template: 'testForm'
});

TestApp.SuccessView = GoodPosture.FormItemView.extend({
  template: 'success'
});


TestApp.Router = Backbone.Router.extend({
  routes: {
    "test/:step": "goThere",
  },
  goThere: function(step) {
    TestApp.mainRegion.show(new TestApp[step + 'View']({
    model: model}), {forceShow: true});
  }
});

var testHelper = {
  filloutForm: function() {
    visit('test/Form');
    fillIn("First Name", "Testo")
    fillIn("Last Name", "McGee")
  }
}


TestApp.transition = function(route) {
  TestApp.router.navigate(route, {trigger: true})
}

$(function() {
  TestApp.router = new TestApp.Router()
  Backbone.history.start()
});
