define(function(require) {

var AlertView = require('views/site/alert')
  , tpl = require('text!templates/wishes/create_wish.mustache') 
  , Wish = require('models/wish')

  return Backbone.View.extend({

    template: Hogan.compile(tpl),
   
    className: 'modal modal-wish',

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
      if (tArea.val() == '') return
      var params = this.$('form').serializeObject();
      params.author = window.user.toJSON()
      var self = this
      $.post('/wishes', params, function(data){
        $('.modal-backdrop').remove();
        $('.modal').remove();
        self.notice('Wish created')
      }) 
    },

    notice: function(msg){
      var successAlert = new AlertView({
        message: '<strong>'+msg+'</strong>',
        type: 'info'
      })
      successAlert.fadeOut()
    },

  });

});
