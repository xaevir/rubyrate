define(function(require) {
  var Wish = require('models/wish')

  var Wishes = Backbone.Collection.extend({
      url: '/wishes',
      model: Wish,
  });

  return Wishes;

});
