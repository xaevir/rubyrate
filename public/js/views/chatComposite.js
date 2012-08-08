define(function(require) {

var RestrictedView = require('views/site/restricted')         

return Backbone.View.extend({

  className: 'chat-composite',

  events: {
    "click a:not(.reply)": "pushState",
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
    if (options && options.noReply)
      this.noReply = options.noReply
    if (options && options.bigTextarea)
      this.bigTextarea = options.bigTextarea
  },

  render: function(){
    $(this.el).append(this.messagesView.render().el)
    this.$el.append('<span class="point"></span><span class="point-under"></span>')
    if (this.noReply == undefined)
      this.$el.append('<a href="#" class="btn btn-warning reply">Reply</a>')
    return this
  },

  renderReplyForm: function(e){
    e.preventDefault()
    if (!this.user.isLoggedIn()) return new RestrictedView().render()  
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
