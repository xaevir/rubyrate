define(function(require) {

  var Message = Backbone.Model.extend({

    idAttribute: "_id",

    validation: {
      body:      {required: true},
    }
  })

  return Message

})
