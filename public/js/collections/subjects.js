define(function(require) {
  var Subject = require('models/subject')

  return Backbone.Collection.extend({
      url: '/subjects',
      model: Subject,
  })
})
