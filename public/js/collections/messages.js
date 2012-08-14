define(function(require) {
  var Message = require('models/message')

  var Messages = Backbone.Collection.extend({
    url: '/messages',
    model: Message,
  });

  return Messages;

});
