define(function(require) {

var tpl = require('text!templates/users/profile.mustache')

return Backbone.View.extend({

  className:  "span3 offset4 small-content",

  template: Hogan.compile(tpl),

  initialize: function(){
    _.bindAll(this) 
  },

  render: function(user) {
    var template = this.template.render(user)
    $(this.el).html(template);
    return this;
  },

});

})
