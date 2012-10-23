define(function(require) {

var AlertView = require('views/site/alert').alert
  , tpl = require('text!templates/emergencies/create_emergency.mustache') 
  , Emergency = require('models/emergency')

  return Backbone.View.extend({

    template: Hogan.compile(tpl),
   
    className: 'modal modal-emergency',

    events: {
      'submit form' : 'submit'
    },

    button: '',

    initialize: function() {
      _.bindAll(this);
    },

    render: function () {
      var template = this.template.render();
      $(this.el).html(template);
      $(this.el).modal('show');
      this.button = $('button[type="submit"]', this.el);
    },

    submit: function (e) {
      e.preventDefault()
      var tArea = $('#textarea-modal')
      if (tArea.val() == '') 
        return
      var params = this.$('form').serializeObject();
      var self = this
      $.post('/emergencies', params, function(data){
        $('.modal-backdrop').remove();
        $('.modal').remove();
        new AlertView('Emergency created')
        window.events.trigger("emergencyCreated-create_emergency.js");
      }) 
    },

  });

});
