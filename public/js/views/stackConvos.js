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

  initialize: function(convos) {
    _.bindAll(this)
    this.convos = convos
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

  addOne: function(convo, index) {
    var view = new ChatView({collection: new Messages(convo.value.comments), user: this.user});
    var colClass = '.col' + this.counter
    $(colClass, this.el).append(view.render().el)
    this.changeCounter()
  },

  render: function() {
    _.each(this.convos, this.addOne, this);
    return this
  },
})

})
