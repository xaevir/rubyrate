define(function(require) {

  var Contact = Backbone.Model.extend({

    initialize: function(subject_id) {
      this.set({subject_id: this.collection.subject_id })
      this.set({cid: this.cid})
    },

    idAttribute: "_id",

    validation: {
      username:      {required: true},
    }
  })

  return Contact

})
