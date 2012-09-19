define(function(require) {

var tpl = require('text!templates/home.html')
  , thankyouTpl = require('text!templates/wish_thankyou.html')
  , HomepageWish = require('models/homepage_wish') 
  , LetterView = require('views/letter')      
  , NewUser = require('models/newUser')

return Backbone.View.extend({

  initialize: function(options){
    _.bindAll(this); 
    this.state = options.state
    this.model = new HomepageWish();
    Backbone.Validation.bind(this);
    this.model.on('sync', this.onSync, this)
    if (options.state)
      this.onSync()
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
    new LetterView(thankyouTpl)
    //var router = new Backbone.Router();
    //router.navigate('wishes', {trigger: true}) 
    this.render()
  }

});

});
