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
    this.remove() 
    new AlertView('Hello')
    this.afterSuccess()
  },

  afterSuccess: function(){
    var router = new Backbone.Router()
    router.navigate('', true);
  },

  renderError: function(){
    if (this.happened) return  
    this.happened = true 

    var alertView = new AlertView({message: 'Heads Up! Please check your email or password', 
                               type: 'error', 
                               element: this.el,
                               doNotFadeOut: true})
  },
});

});
