define(function(require) {
  var ContactedCompany = require('models/contacted-company')

  return Backbone.Collection.extend({

    model: ContactedCompany,

    initialize: function(models, options) {
      this.url = '/wishes/'+options.wishes_id+'/contacted-companies'  
    },
  });

});
