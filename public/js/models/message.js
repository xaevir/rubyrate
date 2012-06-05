define(function(require) {

  var Message = Backbone.Model.extend({

    idAttribute: "_id",

    validation: {
      //username:    {required: true},
      body:      {required: true},
      //kickoff:   {required: true}
    }
  })

  return Message

})
