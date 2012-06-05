define(function(require) {
  var Alert = require('models/alert')

  return Backbone.Collection.extend({
      model: Alert,
  });
});
