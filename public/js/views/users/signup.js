define(function(require) {

var tpl = require('text!templates/users/signup.html')
  , AlertView = require('views/site/alert')

return Backbone.View.extend({

  initialize: function(options){
    _.bindAll(this); 
    this.user = options.user 
    Backbone.Validation.bind(this);
    this.context = options.context
    if (options.context == 'main')
      $(this.el).addClass('small-content')
    if (options.passThru)          
      this.passThru = options.passThru
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
      new AlertView('Thank you for signing up!')
      if (!this.passThru) {
        router = new Backbone.Router();
        router.navigate('/', true)
      }
    } 
  },

});


});
