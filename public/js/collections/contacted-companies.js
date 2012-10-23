define(function(require) {
  var ContactedCompany = require('models/contacted-company')

  return Backbone.Collection.extend({

    model: ContactedCompany,

    initialize: function(models, options) {
      this.url = '/emergencies/'+options.emergencies_id+'/contacted-companies'  
    },
  });

});
