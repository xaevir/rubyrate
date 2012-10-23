Backbone = require('backbone')
_ = require('underscore')
var Validation = require('../public/js/libs/backbone.validation/backbone.validation')
_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);


_.extend(Backbone.Validation.validators, {
  isArray: function(value, attr, customValue, model){
    if (!_.isArray(value))
      return 'value not array'
  }
})


var Subject = module.exports = Backbone.Model.extend({

  initialize: function(attrs) {
    this.set('shortId', this.makeShortId())   
  },

  validation: {
    author: { required: true },
    authorSlug: { required: true },
    body: { required: true },
    location: { required: true },
    users: { isArray: true },
  },

  makeShortId: function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
})

