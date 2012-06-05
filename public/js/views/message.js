define(function(require) {

return Backbone.View.extend({

  tagName:  "h1",
  className: 'msg',

  template: Hogan.compile('<b>{{author}}:</b> {{body}} <span title="{{time}}">Sent: {{time}}</span>'),

  initialize: function(message) {
    _.bindAll(this, 'render');
    this.message = message
  },

  render: function() {
    var locals = this.message
    var username = window.user.get('username')    
    if (username != locals.author) 
      $(this.el).addClass('colored')
    if (username == locals.author) 
      locals.author = 'Me'
    var prettyTime = $.shortDate(locals._id)
    locals.time = prettyTime
    var template = this.template.render(locals)
    $(this.el).html(template);
    return this;
  },
})
})
