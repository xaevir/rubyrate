define(function(require) {

var tpl = require('text!templates/reply.mustache')
  , ReplyView = require('views/reply')
  , MessagesView = require('views/messages') 
  , Messages = require('collections/messages')
  , RestrictedView = require('views/site/restricted')         

return Backbone.View.extend({

  className: 'chat-composite',

  events: {
    'click .reply' : 'renderReplyForm',
  },

  initialize: function(options) {
    _.bindAll(this)
    if (!options.subject_id) 
      throw new Error('need subject_id')
    this.context = options.context
  },

  render: function(){
    this.$el.append('<a href="#" class="reply">Reply</a><i class="bubble-lrg"></i><i class="bubble-sml"></i>')
    return this
  },

  renderReplyForm: function(e){
    e.preventDefault()
    if (!window.user.isLoggedIn()) return new RestrictedView().render()  
    this.replyView = new ReplyView({subject_id: this.subject_id, context: this.context, parentView: this})
    var form = this.replyView.render().el
    $(this.el).append(form)
    //movement
    $('i', this.el).fadeOut() 
    $('.reply', this.el).slideUp()
    $(form).slideDown()
  },
  
  closeReplyForm: function(e) {
    $(this.replyView.el).slideUp()
    $('.reply', this.el).slideDown()
    $('i', this.el).fadeIn() 
  }


})
 

})
