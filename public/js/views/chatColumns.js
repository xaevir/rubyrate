define(function(require) {

var ChatCompositeView = require('views/chatComposite')         

return Backbone.View.extend({

  className: 'chat-columns row',  
  counter: 1,
  
  columns: 3,

  initialize: function(options) {
    _.bindAll(this)
    this.views = options
    /*
    this.manyChats = options.manyChats
    this.singleChat = options.singleChat
    this.columns = options.columns || this.columns
    this.context = options.context
    this.truncate = options.truncate
    /*
    if (this.manyChats)
      this.render = this.renderMany
    else
      this.render = this.renderOne
    */
  },

  changeCounter: function(){
    this.counter += 1
    if (this.counter > this.columns ) this.counter = 1;
    return this.counter
  },

  addOne: function(view) {
    // fix below
    //if (this.context == 'appView')
    //  messagesOfChat = messagesOfChat.value.comments
    //var view = new ChatCompositeView({messagesOfChat: messagesOfChat, context: this.context, truncate: this.truncate});
    var colClass = '.col-' + this.counter
    var html = view.render().el
    $(colClass, this.el).append(html)
    this.changeCounter()
  },

  render: function(){
    for (i=1; i<this.columns+1; i++){
      $(this.el).append('<div class="span4 col-'+i+'">')
    }
     _.each(this.views, this.addOne, this);
    return this
  },

  renderOne: function() {
    var view = new ChatCompositeView({messagesOfChat: this.singleChat});
    $(this.el).append(view.render().el)
    return this
  },
})

})
