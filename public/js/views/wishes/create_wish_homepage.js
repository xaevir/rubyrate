define(function(require) {

var tpl = require('text!templates/wishes/wish-homepage.html')
  , Wish = require('models/wish') 
  , AlertView = require('views/site/alert')       

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

  render: function(){
    $(this.el).html(tpl);
    return this; 
  },

  submit: function(e) {
    e.preventDefault()
    var self = this
    var params = this.$('form').serializeObject();
    this.model.url = '/wishes-home'
    var result = this.model.set(params) 
    if (result === false) 
      return
    var slug =  this.model.get('author').replace(/[^a-zA-z0-9_\-]+/g, '-').toLowerCase()
    this.model.set('slug', slug)
    this.model.save()
  },

  onSync: function(){
    AlertView.notice('Wish created')
    var router = new Backbone.Router();
    router.navigate('wishes', {trigger: true}) 
  }

});

});
