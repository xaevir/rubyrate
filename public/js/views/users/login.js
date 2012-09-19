define(function(require) {

var tpl = require('text!templates/users/login.html')
  , Session = require('models/session') 
  , AlertView = require('views/site/alert').alert         
  , AlertErrorView = require('views/site/alert').error         
  , AlertContainedView = require('views/site/alert').contained         

var login = {}

login.login = Backbone.View.extend({

  events: {
    'submit form' : 'submit'
  },

  errorMsg: 'Heads Up! Please check your email or password',

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
    this.close()
    new AlertView('Hello')
  },

  close: function(){
    this.remove() 
    var router = new Backbone.Router()
    router.navigate('', true);
  },

  renderError: function(){
    new AlertErrorView(this.errorMsg)
  },

});

  
login.modal = login.login.extend({
  initialize: function(options){
    login.login.prototype.initialize.call(this,options)
    this.parent = options.parent
  },

  close: function(){
    this.parent.close()
  },

  renderError: function(){
    if (this.happened) return  
    this.happened = true 
    var alert = new AlertContainedView(this.errorMsg)
    var html = alert.render().el
    $(this.el).prepend(html)
  },
})

return login
});
