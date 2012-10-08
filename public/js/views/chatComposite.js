define(function(require) {

var RestrictedView = require('views/site/restricted'),
    TimerView = require('views/timer')

return Backbone.View.extend({

  className: 'chat-composite',

  events: {
    "click a:not(.btn)": "pushState",
    'click .reply' : 'renderReplyForm',
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
    this.user = options.user
    this.unread = options.unread
    this.viewRepliesFor = options.viewRepliesFor
    this.timer = options.timer
    if (options && options.noReply)
      this.noReply = options.noReply
  },

  render: function() {
    $(this.el).append(this.messagesView.render().el)
    if(this.unread)
      $(this.el).addClass('unread')
    if (this.noReply == undefined)
      this.$el.append('<a href="#" class="btn reply">Reply</a>')
    if (this.viewRepliesFor)
      $('.metadata', this.el).append('<li><a class="view-replies" href="/wishes/' + this.viewRepliesFor + '">view replies</a></li>')
    if(this.timer) {
      var timer = new TimerView(60) 
      var html = timer.render().el
      this.$el.prepend(html)
    }
      
    return this
    
    
  },

  renderReplyForm: function(e){
    e.preventDefault()
    if (!this.user.isLoggedIn()) return new RestrictedView(this.user).render()  
    //this.replyView = new ReplyView({subject_id: this.subject_id, context: this.context, parentView: this})
    this.replyView.render()
    $(this.el).append(this.replyView.el)

    //movement
    $('.point', this.el).fadeOut() 
    $('.point-under', this.el).fadeOut() 
    $('.reply', this.el).slideUp()
    $(this.replyView.el).slideDown()
    if (this.bigTextarea) 
      $(this.el).attr('id','bigTextarea')
  },
  
  closeReplyForm: function(e) {
    $(this.replyView.el).slideUp()
    //$('.reply', this.el).slideDown()
    $('.point', this.el).fadeIn() 
    $('.point-under', this.el).fadeIn() 
    if (this.bigTextarea) 
      $(this.el).removeAttr('id')
  },
})
})
