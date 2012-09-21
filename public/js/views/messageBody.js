define(function(require) {

var tpl = require('text!templates/messageBody.mustache')
  , EditView = require('views/editMessage')

return Backbone.View.extend({

  className: 'msg',

  template: Hogan.compile(tpl),

  events: {
    'click .edit' : 'edit',
  },

  initialize: function(options) {
    _.bindAll(this, 'render');
    this.truncate = options.truncate 
    this.user = options.user
  },

  edit: function(e) {
    e.preventDefault() 
    var editView = new EditView({model: this.model});
    editView.render()
    return false
  },

  render: function() {
    var locals = this.model.toJSON()
    var username = this.user.get('username')    

    if (this.truncate && locals.body.length > this.truncate) 
        locals.body = locals.body.substr(0, this.truncate) + '...' 

    if (username == locals.author) 
      locals.author = 'Me'
    else 
      locals.makeProfileLink = true

    if (this.user.get('role') == 'admin')
      locals.edit = true

    var prettyTime = $.shortDate(locals._id)
    locals.time = prettyTime
    var template = this.template.render(locals)
    $(this.el).html(template);
    return this;
  },
})
})
