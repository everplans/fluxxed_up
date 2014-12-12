//= require spec_helper
//= require fixtures/fixtures


describe("Good Posture", function() {

  describe("Handlebars widgets", function() {
    beforeEach(function(done) {
      bootstrapBackbone();
      start();
      visit('test/Form');
      finish(done);
    });

    it("Shows Form", function() {
      expect($('body')).to.contain("this is the form");
    });

    it("Has text field", function() {
      expect($("input[name='firstName']").attr('type')).to.equal('text');
    });

    it("Has submit button", function() {
      expect($("button:contains('Next')").attr('type')).to.equal('submit');
    });
  });

  describe("Form interactions", function() {
    beforeEach(function(done) {
      bootstrapBackbone();
      start();
      visit('test/Form');
      fillIn("First Name", 'steve')
      clickButton("Next")
      finish(done);
    });

    it("Updates the model", function() {
      expect(model.get('firstName')).to.equal("steve")
    });

    it("Transitions to the next view", function() {
      expect($('body')).to.contain("Success!");
    });

  });
});
