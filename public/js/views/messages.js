define(function(require) {

var MessageBodyView = require('views/messageBody') 

var MessageItem = Backbone.View.extend({

  tagName:  "li",

  events: {
    'click .reply' : 'edit',
  },

  edit: function(e) {
    e.preventDefault() 
    var linkEl = $(e.currentTarget);
    var href = linkEl.attr("href");
  },

  initialize: function(options) {
    this.message = options.message
    this.truncate = options.truncate
    this.user = options.user
    _.bindAll(this, 'render');
  },

  render: function() {
    var view = new MessageBodyView(this.options)
    $(this.el).html(view.render().el)
 
    // add color if me 
    var username = this.user.get('username')    
    if (this.message.author == 'Me')
      $(this.el).addClass('colored')

    if (this.user.get('role') == 'admin')
      $(this.el).prepend('<div class="admin-options"><a href="/messages/'+this.message._id+'/edit">edit</a></div>')

    return this;
  },

})


return  Backbone.View.extend({

  className: 'messages',  
  tagName: 'ul',

  //counter: 1,

  initialize: function(options) {
    _.bindAll(this);
//    this.collection.bind('add', this.addOne, this)
    this.truncate = options.truncate
    this.messagesOfChat = options.messagesOfChat
    this.user = options.user
  },

  addOne: function(message) {
    if (message.unread == true)
      this.unread() 
    var opts = {message: message, user: this.user}
    if (this.truncate)
      opts.truncate = this.truncate
    var messageItem = new MessageItem(opts)
    $(this.el).append(messageItem.render().el)
  },

  render: function() {
    if (_.isArray(this.messagesOfChat)) 
      _.each(this.messagesOfChat, this.addOne, this);
    else
      this.addOne(this.messagesOfChat)

    if(this.messagesOfChat.length > 1) 
      $(this.el).addClass('scrollable')
    return this
  },
  
  unread: function(){
    $(this.el).prepend('<div class="unread">New Message</div>')

  },

})

})
