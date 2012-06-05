define(function(require) {

  return Backbone.Model.extend({

    validation: {
      login:        {required: true},
      password:     {required: true}
    }, 

  })
})
