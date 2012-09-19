define(function(require) {

var tpl = require('text!templates/users/signup.html')
  , AlertView = require('views/site/alert').alert         
  , AlertContainedView = require('views/site/alert').contained         

var signup = {}

signup.signup = Backbone.View.extend({

  initialize: function(options){
    _.bindAll(this); 
    this.user = options.user 
    Backbone.Validation.bind(this);
  },

  events: {
    'submit form' : 'submit'
  },

  render: function(){
    $(this.el).html(tpl);
    return this; 
  },

  submit: function(e) {
    e.preventDefault()
    var params = this.$('form').serializeObject();
    var result = this.model.set(params)
    if (result !== false)
      $.post('/user', result.toJSON(), this.xhr_callback) // setting auto slug on model so use toJSON
  },

  xhr_callback: function(res){
    if (res._id) {
      this.user.set(res)
      this.close()
      new AlertView('Thank you for signing up!')
    } 
  },

  close: function(){
    var router = new Backbone.Router()
    router.navigate('', true);
  },

});

signup.modal = signup.signup.extend({

  initialize: function(options){
    signup.signup.prototype.initialize.call(this,options)
    this.parent = options.parent
    this.errorEl = options.errorEl
  },

  close: function(){
    this.parent.close()
  },

  renderError: function(){
    var alert = new AlertContainedView(this.errorMsg)
    $(this.errorEl).prepend(alert.render().el)
  },

})

return signup

});
