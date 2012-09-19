define(function(require) {

var SignupModalView = require('views/users/signup').modal
  , LoginModalView = require('views/users/login').modal         
  , tpl = require('text!templates/tabs.mustache')
  , NewUser = require('models/newUser')

  return Backbone.View.extend({

    className: 'modal fade restricted-modal',

    template: Hogan.compile(tpl),

    initialize: function(user){
      this.user = user
      _.bindAll(this)

      this.signupModalView = new SignupModalView({model: new NewUser(), 
                                                  user: this.user,
                                                  parent: this})
      this.loginModalView = new LoginModalView({user: this.user, 
                                                parent: this})
    },

    render: function(){
      var template = this.template.render();
      $(this.el).html(template);
      var signupEl = this.signupModalView.render().el
      $('#new', this.el).html(signupEl)
      $('#login', this.el).html(this.loginModalView.render().el)
      $(this.el).modal('show');
      $(this.el).center();
    },

    close: function(){
      $(this.el).modal('hide');
      this.remove()
    }

})


})
