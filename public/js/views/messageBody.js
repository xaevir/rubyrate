define(function(require) {

var tpl = require('text!templates/messageBody.mustache')

return Backbone.View.extend({

  tagName:  "span",
  className: 'msg',

  template: Hogan.compile(tpl),

  initialize: function(options) {
    _.bindAll(this, 'render');
    this.message = options.message
    this.truncate = options.truncate 
  },

  render: function() {
    var locals = this.message
    var username = window.user.get('username')    

    if (this.truncate && locals.body.length > this.truncate) 
        locals.body = locals.body.substr(0, this.truncate) + '...' 

    if (username == locals.author) 
      locals.author = 'Me'
    else 
      locals.makeProfileLink = true

    var prettyTime = $.shortDate(locals._id)
    locals.time = prettyTime
    var template = this.template.render(locals)
    $(this.el).html(template);
    return this;
  },
})
})
