define(function(require) {

var AlertView = require('views/site/alert')
  , hogan = require('libs/hogan.js/web/builds/1.0.5/hogan-1.0.5.min.amd')         
  , ChatView = require('views/chat')         
  , RestrictedView = require('views/site/restricted')         
  , MessagesView = require('views/messages')         
  , Messages = require('collections/messages')

return Backbone.View.extend({

  className: 'convos row',  

  tagName: 'ul',

  initialize: function(convo) {
    _.bindAll(this)
    this.convo = convo
  },

  render: function() {
    var view = new ChatView({collection: new Messages(this.convo), user: this.user});
    $(this.el).append(view.render().el)
    return this
  },
})

})
