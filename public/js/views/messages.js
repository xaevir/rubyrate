define(function(require) {

//  , Reply = require('models/reply') 

var MessageItem = Backbone.View.extend({

  tagName:  "li",
  className: 'msg',

  template: Hogan.compile('<b>{{author}}:</b> {{body}} <span title="{{time}}">Sent: {{time}}</span>'),

  initialize: function() {
    _.bindAll(this, 'render');
  },

  render: function() {
    var locals = this.model.toJSON()
    var username = window.user.get('username')    
    if (this.options.public_view) {
      if (username != locals.author) 
        $(this.el).addClass('colored')
      if (locals.body.length > 50) 
        locals.body = locals.body.substr(0, 200) + '...' 
    }
    else {
      if (username == locals.author) 
        $(this.el).addClass('colored')
    }
    if (username == locals.author) 
      locals.author = 'Me'   

    var prettyTime = $.shortDate(locals._id)
    locals.time = prettyTime
    var template = this.template.render(locals)
    $(this.el).html(template);
    return this;
  },

})


return  Backbone.View.extend({

  className: 'messages',  
  tagName: 'ul',

  //counter: 1,

  initialize: function(options) {
    _.bindAll(this, 'render');
    this.collection.bind('add', this.addOne, this)
  },

  addOne: function(model) {
  /*
    var locals;
    if (!(this.counter % 2)) {
      locals.stripe = true;
      locals.className = 'even'
    }
    */
    var messageItem = new MessageItem({model: model, public_view: this.options.public_view})
    $(this.el).append(messageItem.render().el)
    this.counter += 1
  },

  render: function() {
    this.collection.each(this.addOne, this);
    return this
  },
})

})
