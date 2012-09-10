define(function(require) {

var tpl = require('text!templates/home.html')
  , thankyouTpl = require('text!templates/wish_thankyou.html')
  , Wish = require('models/homepage_wish') 
  , AlertView = require('views/site/alert')       
  , NewUser = require('models/newUser')

return Backbone.View.extend({

  initialize: function(options){
    _.bindAll(this); 
    this.model = new Wish();
    Backbone.Validation.bind(this);
    this.model.on('sync', this.onSync, this)
  },

  events: {
    'submit form' : 'submit'
  },

  template: tpl,

  render: function(){
    $(this.el).html(this.template);
    return this; 
  },

  submit: function(e) {
    e.preventDefault()
    var self = this
    var params = this.$('form').serializeObject();
    this.model.save(params)
  },

  onSync: function(){
    new AlertView({message: thankyouTpl, 
                   duration: 5000, 
                   type:"letter", 
                   wrapperClass: 'letterWrapper',
                   bgOpacity: true,
                   doNotFadeOut: true}) 

    var router = new Backbone.Router();
    //router.navigate('wishes', {trigger: true}) 
    this.render()
  }

});

});
