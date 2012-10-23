define(function(require) {

var tpl = require('text!templates/home.html')
  , HomepageEmergency = require('models/homepage_emergency')
  , ThankyouView = require('views/homepage_thankyou')      

return Backbone.View.extend({

  initialize: function(options){
    _.bindAll(this); 
    this.model = new HomepageEmergency();
    Backbone.Validation.bind(this);
    this.model.on('sync', this.onSync, this)
    if (options.thankyou)
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
    var params = this.$('form').serializeObject();
    this.model.save(params)
  },

  onSync: function(model){
    new ThankyouView({model: model})
    //var router = new Backbone.Router();
    //router.navigate('emergencies', {trigger: true}) 
    this.render()
  }

});

});
