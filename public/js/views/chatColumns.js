define(function(require) {

var ChatCompositeView = require('views/chatComposite')         

return Backbone.View.extend({

  className: 'chat-columns row',  
  counter: 1,
  
  columns: 3,

  initialize: function(options) {
    _.bindAll(this)
    this.views = options.views
    this.span = options.span || 4
    if (options.columns)
      this.columns = options.columns 
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
      $(this.el).append('<div class="span'+this.span+' col-'+i+'">')
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
