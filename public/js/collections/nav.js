define([
  'Underscore',
  'Backbone',
  'models/nav'
], function(_, Backbone, navModel){

  var navCollection = Backbone.Collection.extend({
    model: navModel,   
  });

  return new navCollection;
});
