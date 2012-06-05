define(function(require) {

var SignupView = require('views/users/signup')
  , LoginView = require('views/users/login')         
  , tpl = require('text!templates/tabs.mustache')


  return Backbone.View.extend({

    className: 'modal fade restricted-modal',

    template: Hogan.compile(tpl),

    initialize: function(){
      _.bindAll(this, 'render')
      this.signupView = new SignupView({context: 'tabbed', passThru: true})
      this.loginView = new LoginView({context: 'tabbed', passThru: true})
    },

    render: function(){
      var template = this.template.render();
      $(this.el).html(template);
      var signupEl = this.signupView.render().el
      $('#new', this.el).html(signupEl)
      $('#login', this.el).html(this.loginView.render().el)
      $(this.el).modal('show');
      $(this.el).center();
    }
})


})
