define(function(require) {

var tpl = require('text!templates/users/signup.html')
  , AlertView = require('views/site/alert')

require('libs/jquery-validation/jquery.validate')  

$.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^[a-z0-9\-]+$/i.test(value);
}, "Username must contain only letters, numbers, or dashes.");


$.validator.addMethod("uniqueUsername", function(value, element) {
   var isSuccess = false;

   $.ajax({ url: "/is-username-valid", 
            data: {username: value}, 
            async: false, 
            success: 
                function(res) { isSuccess = res === true ? true : false }
          });
    return isSuccess;
}, "Please try another username. This one is taken.");


$.validator.addMethod("uniqueEmail", function(value, element) {
   var isSuccess = false;

   $.ajax({ url: "/check-email", 
            data: {email: value}, 
            async: false, 
            success: 
                function(res) { isSuccess = res === true ? true : false }
          });
    return isSuccess;
}, "This email is already taken. Please try another.");

var validationRules = {
  username: {
    required: true,
    minlength: 2,
    maxlength: 60,
    alphanumeric: true,
    uniqueUsername: true,
  },
  email: {
    required: true,
    email: true,
    uniqueEmail: true,
  },
  password: {
    required: true,
    minlength: 6 
  },
}

var errorMessages = {
  username: {
    required: 'Please enter a username',
    minlength: $.format("Enter at least {0} characters"),
    maxlength: $.format("Please enter no more than {0} characters."),
    alphanumeric: 'A username must contain only letters, numbers, or dashes.',
    //remote: $.validator.format("{0} is taken. Please try another."),
  },
  email: {
    required: 'Please enter an email',
    email: "Please enter a valid email address.",
    uniqueEmail: 'That email is already taken',
  },
  password: {
    required: 'Please enter a password',
    minlength: $.format("Enter at least {0} characters")
  }
}

return Backbone.View.extend({

  initialize: function(options){
    _.bindAll(this, 'render', 'submitHandler', 'xhr'); 
    this.context = options.context
    if (options.context == 'main')
      this.el = $('<div class="span3 offset4 body-content-small">');
    if (options.passThru)          
      this.passThru = options.passThru
  },

  render: function(){
    $(this.el).html(tpl);
    // validate
    var form = $('form', this.el); 
    $(form).validate({
        rules: validationRules,
        messages: errorMessages,
        submitHandler: this.submitHandler, 
    });
    return this; 
  },

  submitHandler: function(){
    var params = $('form', this.el).serializeObject();
    window.user.url = '/signup'
    window.user.save(params, {success: this.xhr, wait: true})
  },

  xhr: function(model, res, xhr){
    if (model.id) {
      this.renderSuccessMessage()
      if (!this.passThru) {
        router = new Backbone.Router();
        router.navigate('/', true)
      }
    } 
  },

  renderSuccessMessage: function(){
    var alertView = new AlertView({
      message: '<strong>Thank you for signing up!</strong>',
      type: 'success',
    });
    alertView.fadeOut()

  }
});


});
