define(function(require) {
  var Contact = require('models/contact')

  var Contacts = Backbone.Collection.extend({
    url: '/contacts',
    model: Contact,
  });

  return Contacts;

});
