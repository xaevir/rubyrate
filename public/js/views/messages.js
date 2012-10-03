define(function(require) {

var MessageBodyView = require('views/messageBody') 

var MessageItem = Backbone.View.extend({

  tagName:  "li",

  initialize: function(options) {
    //this.message = options.message
    this.truncate = options.truncate
    this.user = options.user
    this.model.bind('change', this.render, this);
    _.bindAll(this, 'render');
  },

  render: function() {
    var view = new MessageBodyView(this.options)
    $(this.el).html(view.render().el)
 
    // add color if me 
    var username = this.user.get('username')    
    if (this.model.get('author') == username)
      $(this.el).addClass('colored')

    if (this.model.get('unread'))
      $(this.el).addClass('msg-unread') 

//    if (this.user.get('role') == 'admin')
//      $(this.el).prepend('<div class="admin-options"><a href="/messages/'+this.message._id+'/edit">edit</a></div>')

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
    //this.messagesOfChat = options.messagesOfChat
    this.user = options.user
  },

  addOne: function(model) {
    if (model.get('unread') == true)
      this.unread() 
    this.addTotalMessages(model)

    var opts = {model: model, user: this.user}
    if (this.truncate)
      opts.truncate = this.truncate
    var messageItem = new MessageItem(opts)
    $(this.el).append(messageItem.render().el)
  },

  render: function() {
    this.collection.each(this.addOne, this)
    //if (_.isArray(this.messagesOfChat)) 
      //_.each(this.messagesOfChat, this.addOne, this);
    //else
      //this.addOne(this.messagesOfChat)

    //if(this.messagesOfChat.length > 1)
      $(this.el).addClass('scrollable')
    return this
  },
  
  addTotalMessages: function(model){
    var count = model.get('count')
    if (count > 1)
      $(this.el).prepend('<div class="count">'+count+' other messages</div>')
  },

  unread: function(){
    $(this.el).prepend('<div class="unread">New Message</div>')

  },

})

})
