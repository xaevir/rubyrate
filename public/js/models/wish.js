define(function(require) {

  var Wish = Backbone.Model.extend({

    idAttribute: "_id",

    url: '/wishes',

    defaults: {
      label: 'wish' 
    },

    validation: {
      author:      {required: true},
      body:        {required: true},
      //postal_code: {required: true},
      //urgence:     {required: true}
    }
  })

  return Wish

})
