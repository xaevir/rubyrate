define(function(require) {
  var Emergency = require('models/emergency')

  var Emergencies = Backbone.Collection.extend({
      url: '/emergencies',
      model: Emergency,
  });

  return Emergencies;

});
