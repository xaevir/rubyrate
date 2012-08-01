define(function(require) {

var tpl = require('text!templates/users/login.html')
  , Session = require('models/session') 
  , AlertView = require('views/site/alert')         

return Backbone.View.extend({

  events: {
    'submit form' : 'submit'
  },

  initialize: function(options){
    _.bindAll(this); 
    this.model = new Session();
    this.user = options.user
    Backbone.Validation.bind(this);
    if (options.context == 'main')
      $(this.el).addClass('small-content')
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
    this.model.save(params, {success: this.xhr_callback})
  },

  xhr_callback: function(model, res){
    if (res.success === false)
      return this.renderError()
    this.user.set(res)
    // display hello and remove error
    this.remove() 
    new AlertView('Hello')
    if (!this.passThru) {
      var router = new Backbone.Router()
      router.navigate('', true);
    }
  },

  renderError: function(){
    if (this.happened) return  
    this.happened = true 
    new AlertView({
      message: 'Heads Up! Please check your email or password', 
      type: 'error', 
      doNotFadeOut: true,
      doNotStickAround: true
    })
  },
});

});
