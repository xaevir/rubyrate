define(function(require) {

var AlertView = require('views/site/alert')
  , tpl = require('text!templates/wishes/create_wish.mustache') 
  , Wish = require('models/wish')

  var CreateView = Backbone.View.extend({

    template: Hogan.compile(tpl),
   
    className: 'modal modal-wish',

    events: {
      'keyup :input': 'setAttr',
      'change select': 'setAttr',
      'paste :input':  'onPaste',
      'submit form' : 'submit'
    },

    button: '',

    initialize: function() {
      _.bindAll(this, 'render', 'submit');
      this.model = new Wish();
      this.model.set({author: window.user})
      Backbone.Validation.bind(this);
      this.model.bind("validated:valid", this.valid, this);
      this.model.bind("validated:invalid", this.invalid, this);
    },

    onPaste: function(el){
      var setAttr = this.setAttr
      setTimeout(function(){setAttr(el)}, 100)
    },

    setAttr: function(e) {
      var TABKEY = 9;
      if(e.keyCode == TABKEY) return 
      var field = $(e.currentTarget);
      var name = field.attr('name');
      var value = field.val();
      var attr = {};
      attr[name] =value
      this.model.set(attr)
    },

    valid: function(model) {
      if (this.button.hasClass('btn-primary')) return 
      this.button.removeAttr('disabled');
      this.button.addClass('btn-primary')
    },

    invalid: function(model) {
      if (!this.button.hasClass('btn-primary')) return 
      this.button.removeClass('btn-primary')
      this.button.attr('disabled', 'true')
    },
  
    render: function () {
      var template = this.template.render();
      $(this.el).html(template);
      $(this.el).modal('show');
      this.button = $('button[type="submit"]', this.el);
    },

    submit: function (e) {
      e.preventDefault()
      this.model.save();
      $('.modal-backdrop').remove();
      $('.modal').remove();
      this.notice('Wish created')
    },

    notice: function(msg){
      var successAlert = new AlertView({
        message: '<strong>'+msg+'</strong>',
        type: 'info'
      })
      successAlert.fadeOut()
    },


  });

  return CreateView

});
