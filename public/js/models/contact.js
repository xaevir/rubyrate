define(function(require) {

  return Backbone.Model.extend({
    
    url: '/contact',

    validation: {
      name: {
        required: true,
        msg: 'Please enter your name'
      },
      email: {
        required: true,
        pattern: 'email',
        msg: 'Please enter a valid email'
      },
      message: {
        required: true,
        msg: 'Please enter a message'
      },
    }, 

  })
})
