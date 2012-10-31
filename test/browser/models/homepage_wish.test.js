define(function(require) {

  var expect = chai.expect,
      HomepageWish = require('models/homepage_wish');

  describe("Homepage Wish Model", function() {
    describe("validation()", function() {
      it("should not save when a required attributes emtpy", function() {
        var homepageWish = new HomepageWish() 
        var View = Backbone.View.extend({});
        var view = new View({model: homepageWish});
        Backbone.Validation.bind(view);
        var eventSpy = sinon.spy();
        homepageWish.bind("error", eventSpy);
        homepageWish.save({body: "",
                           contact_info: "",
                           username: "",
                           location: "",
                           when: ""})
        expect(eventSpy).to.have.been.calledOnce;
        expect(eventSpy).to.have.been.calledWith(homepageWish, 
          {body: "required",
           contact_info: "required",
           username: "required",
           location: "required",
           when: 'required'
          });
      });
    });
  });

})
