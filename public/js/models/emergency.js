if (typeof exports === 'object' && typeof define !== 'function') {
  define = function (factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require) {

  var Emergency = Backbone.Model.extend({

    idAttribute: "_id",

    url: '/emergencies',

    defaults: {
      label: 'emergency' 
    },

    validation: {
      author:      {required: true},
      authorSlug: {required: true},
      body:        {required: true},
      location:    {required: true},
    }

  })

  return Emergency

})
