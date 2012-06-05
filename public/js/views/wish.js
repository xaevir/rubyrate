define(function(require) {

var AlertView = require('views/site/alert')
  , ChatView = require('views/chat')         
  , RestrictedView = require('views/site/restricted')         
  , MessageView = require('views/message')         
  , Messages = require('collections/messages')
  , tpl = require('text!templates/wish.mustache')

return Backbone.View.extend({

  className: 'convos row',  

  tagName: 'ul',

  template: Hogan.compile(tpl),

  initialize: function(options) {
    _.bindAll(this)
    this.subject = options.subject
    this.replies = options.replies
    $(this.el).append('<div class="span4 col1">')
    $(this.el).append('<div class="span4 col2">')
    $(this.el).append('<div class="span4 col3">')
  },

  changeCounter: function(){
    this.counter += 1
    if (this.counter > 3 ) this.counter = 1;
    return this.counter
  },

  counter: 1,

  addOne: function(reply, index) {
    var view = new ChatView({collection: new Messages(reply)});
    var colClass = '.col' + this.counter
    $(colClass, this.el).append(view.render().el)
    this.changeCounter()
  },

  render: function() {
    _.each(this.replies, this.addOne, this);

    var subject = new MessageView(this.subject)
    var subjectEl = subject.render().el
    var subjectHtml = $('<div>').html(subjectEl)
    var template = $(this.template.render({subject: subjectHtml.html(), replies: $(this.el).html()}))
    this.el = template
    return this
  },
})

})
