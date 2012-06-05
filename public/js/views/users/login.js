define(function(require) {

var tpl = require('text!templates/users/login.html')
  , Session = require('models/session') 
  , AlertView = require('views/site/alert')         

var LoginView = Backbone.View.extend({

  events: {
    'submit form' : 'submit'
  },

  initialize: function(options){
    _.bindAll(this); 
    this.model = new Session();
    Backbone.Validation.bind(this);
    this.model.bind('validated:valid', this.post, this) 
    if (options.context == 'main')
      $(this.el).addClass('span3 offset4 body-content-small')
    if (options.passThru)          
      this.passThru = options.passThru
  },

  render: function(){
    $(this.el).html(tpl);
    return this; 
  },

  submit: function(e) {
    e.preventDefault()
    var params = this.$('form').serializeObject();
    this.model.set(params)
  },

  post: function(model){
   var that = this
   $.post('/session', model.toJSON(), function(data){
      if (data._id) {
      window.user.set(data)
      that.close()
      if (!this.passThru) {
        var router = new Backbone.Router()
        router.navigate('', true);
      }
    } 
    else {
      that.renderErrorAlert()
    }
   }) 
  },

  renderErrorAlert: function(){
    if (this.happened) return  
    this.happened = true 
    this.errorAlert = new AlertView({
      message: '<strong>Heads Up!</strong> Please check your email or password',
      type: 'error'
    }) 
  },

  close: function(){
    this.remove()
    if (this.errorAlert)
      this.errorAlert.remove()
    this.alertIntoNextView() 
  },

  alertIntoNextView: function(){
    var successAlert = new AlertView({
      message: '<strong>Hello</strong>',
      type: 'info'
    })
    successAlert.fadeOut()
  }

});

  return LoginView;

});
