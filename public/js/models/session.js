define(function(require) {

  return Backbone.Model.extend({
    url: '/session',
    validation: {
      login:        {required: true},
      password:     {required: true}
    }, 

    parse: function(res){
      if (res.success === false) 
        return {}
    }

  })
})
