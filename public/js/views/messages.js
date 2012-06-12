define(function(require) {

var MessageBodyView = require('views/messageBody') 

var MessageItem = Backbone.View.extend({

  tagName:  "li",

  initialize: function(options) {
    this.message = options.message
    this.truncate = options.truncate
    _.bindAll(this, 'render');
  },

  render: function() {
    var view = new MessageBodyView(this.options)
    $(this.el).html(view.render().el)
 
    // add color if not you
    var username = window.user.get('username')    
    if (this.message.author != 'Me' )
      $(this.el).addClass('colored')

    return this;
  },

})


return  Backbone.View.extend({

  className: 'messages',  
  tagName: 'ul',

  //counter: 1,

  initialize: function(options) {
    _.bindAll(this, 'render');
//    this.collection.bind('add', this.addOne, this)
    this.truncate = options.truncate
    this.messagesOfChat = options.messagesOfChat
  },

  addOne: function(message) {
    var opts = {message: message}
    if (this.truncate)
      opts.truncate = this.truncate
    var messageItem = new MessageItem(opts)
    $(this.el).append(messageItem.render().el)
  },

  render: function() {
      _.each(this.messagesOfChat, this.addOne, this);
    return this
  },
})

})
