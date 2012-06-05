define(function(require) {

var tpl = require('text!templates/reply.mustache')
  , ReplyView = require('views/reply') 
  , MessagesView = require('views/messages') 
  , Messages = require('collections/messages')
  , RestrictedView = require('views/site/restricted')         

var ChatView = Backbone.View.extend({

  className: 'chat-unit convo-item',

  events: {
    'click .reply' : 'render_reply_form',
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'render_reply_form')
    this.messagesView = new MessagesView({collection: this.collection, public_view: options.public_view})
  },

  render: function(){
    $el = $(this.el)
    $el.html(this.messagesView.render().el) 
    $el.append('<a href="#" class="reply">Reply</a><i class="bubble-lrg"></i><i class="bubble-sml"></i>')
    if (this.options.public_view) {
      var aMessage = this.collection.at(0)
      var id = aMessage.get('_id')
      $('a', this.el).after('<a class="view-reply" href="/wishes/' + id + '">view replies</a>')
    }
    return this
  },

  render_reply_form: function(e){
    e.preventDefault()
    if (!window.user.isLoggedIn()) return new RestrictedView().render()  
    var aMessage = this.collection.at(0)
    var opts = {}
    opts.collection = this.collection
    if (aMessage.get('label') == 'wish') 
      opts.subject_id = aMessage.get('_id')
    else {
      opts.subject_id = aMessage.get('subject_id')
      opts.convo_id = aMessage.get('convo_id') 
    }
    var replyView = new ReplyView(opts)
    var form = replyView.render().el
    $(form).css('display', 'none')
    $(this.el).append(form)
    //movement
    $('i', this.el).fadeOut() 
    $('.reply', this.el).slideUp()
    $(form).slideDown()
  }
})
 
return ChatView

})
