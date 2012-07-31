define(['/test.js'], function(Test) {

  //var testedRoutes = require('views/wishes/create_wish_homepage');
  var expect = chai.expect;

  describe("AppRouter routes", function() {
    
    it("fires the home route with a blank hash", function() {
      expect(true).to.be.true;
      console.log('hi')
    });
  });

  /*
  describe("Tested Routes", function() {

    beforeEach(function() {
      this.router = testedRouter()
    });

    describe("home()", function() {
      it("loads the createWishHomepageView", function() {
      this.createWishHomepageViewStub = sinon.stub(window, "CreateWishHomepageView")
        .returns(new Backbone.View());
        expect(this.createWishHomepageViewStub).toHaveBeenCalledOnce();
      })
    })

  })
  */
});
