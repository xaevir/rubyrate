define(function(require) {

var SignupView = require('views/users/signup')
  , LoginView = require('views/users/login')         
  , tpl = require('text!templates/tabs.mustache')
  , NewUser = require('models/newUser')




  return Backbone.View.extend({

    className: 'modal fade restricted-modal',

    template: Hogan.compile(tpl),

    initialize: function(user){
      this.user = user
      _.bindAll(this, 'render')

      SignupView.prototype.afterSuccess = this.bind(this.close, this) 
      this.signupView = new SignupView({model: new NewUser(), user: this.user})
     
      LoginView.prototype.afterSuccess = this.bind(this.close, this)
      this.loginView = new LoginView({user: this.user})
    },

    render: function(){
      var template = this.template.render();
      $(this.el).html(template);
      var signupEl = this.signupView.render().el
      $('#new', this.el).html(signupEl)
      $('#login', this.el).html(this.loginView.render().el)
      $(this.el).modal('show');
      $(this.el).center();
    },

    close: function(){
      this.remove() 
    }, 

    bind: function(func, obj) { 
      temp = function() { 
        return func.apply(obj, arguments); 
      }; 
      return temp; 
    },

})


})
