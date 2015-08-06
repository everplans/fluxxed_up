import featureFlags from '../../src/lib/FeatureFlags'

describe("FeatureFlags", function() {
  var flags = [{flag: "coolNewThing", status: 'ENABLED'}, {flag: "freeAccess", status: 'DISABLED'}];

  beforeEach(function() {
    featureFlags.init(flags);
  });

  it("has enabled feature", function() {
    expect(featureFlags.isEnabled('coolNewThing')).to.be.true
  });

  it("has non enabled feature", function() {
    expect(featureFlags.isEnabled('freeAccess')).to.be.false
  });

  it("has falsy feature if it doesn't exist", function() {
    expect(featureFlags.isEnabled('noExisto')).to.be.false
  });
});