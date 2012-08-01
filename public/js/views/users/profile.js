define(function(require) {

var tpl = require('text!templates/users/profile.mustache')

return Backbone.View.extend({

  className:  "small-content",

  template: Hogan.compile(tpl),

  initialize: function(){
    _.bindAll(this) 
  },

  render: function(user) {
    var template = this.template.render(user)
    $(this.el).html(template);
    var loc = $('#location', this.el)
    var newLined = loc.html().replace(/\n/g, '<br />')
    loc.html(newLined)
    return this;
  },

});

})
