define(function(require) {

var RestrictedView = require('views/site/restricted')         

return Backbone.View.extend({

  className: 'chat-composite',

  events: {
    'click .reply' : 'renderReplyForm',
    'click .view-reply' : 'pushState',
  },

  pushState: function(e) {
    e.preventDefault() 
    var linkEl = $(e.currentTarget);
    var href = linkEl.attr("href");
    var router = new Backbone.Router();
    router.navigate(href.substr(1), true)
  },



  initialize: function(options) {
    _.bindAll(this)
    if (options && options.noReply)
      this.noReply = options.noReply
  },

  render: function(){
    $(this.el).append(this.messagesView.render().el)
    if (this.noReply == undefined)
      this.$el.append('<a href="#" class="reply">Reply</a><i class="bubble-lrg"></i><i class="bubble-sml"></i>')
    return this
  },

  renderReplyForm: function(e){
    e.preventDefault()
    if (!window.user.isLoggedIn()) return new RestrictedView().render()  
    //this.replyView = new ReplyView({subject_id: this.subject_id, context: this.context, parentView: this})
    this.replyView.render()
    $(this.el).append(this.replyView.el)
    //movement
    $('i', this.el).fadeOut() 
    $('.reply', this.el).slideUp()
    $(this.replyView.el).slideDown()
  },
  
  closeReplyForm: function(e) {
    $(this.replyView.el).slideUp()
    $('.reply', this.el).slideDown()
    $('i', this.el).fadeIn() 
  }


})
 

})
