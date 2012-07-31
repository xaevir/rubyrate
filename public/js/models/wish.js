if (typeof exports === 'object' && typeof define !== 'function') {
  define = function (factory) {
    module.exports = factory(require, exports, module);
  };
}

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
      location:    {required: true},
    }

  })

  return Wish

})
