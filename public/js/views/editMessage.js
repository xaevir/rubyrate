define(function(require) {

var AlertView = require('views/site/alert').alert
  , tpl = require('text!templates/editMessage.mustache') 
  //, Wish = require('models/wish')

  return Backbone.View.extend({

    template: Hogan.compile(tpl),
   
    className: 'modal modal-edit',

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
      this.globalEvent()
      this.button = $('button[type="submit"]', this.el);
    },

    submit: function (e) {
      e.preventDefault()
      var tArea = $('#textarea-modal')
      if (tArea.val() == '') 
        return
      //var params = this.$('form').serializeObject();
      var self = this
      this.model.save({body: tArea.val()}) 
      this.close()
      new AlertView('Message Updated')
    },
  
    
    globalEvent: function(){
      var func = _.bind(this.close, this)
      $('.modal-backdrop').click(function(){
        func() 
      });
    },
    

    close: function() {
      $(this.el).modal('hide');
      this.remove()
    }

  });

});
