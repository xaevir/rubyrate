define(function(require) {

var TimerView = require('views/timer')
  , tpl = require('text!templates/homepage_thankyou.html')


return Backbone.View.extend({

  id: 'homepage-thanks',

  template: tpl,

  initialize: function(options){
    _.bindAll(this) 
    this.globalEvent()
    this.render()
  },

  events: { 
    'click .close' : 'close'
  },

  globalEvent: function(){
    var func = _.bind(this.close, this)
    $('body').click(function(){
      func() 
    });
  },

  render: function(){
    $(this.el).html(tpl)
    var timer = new TimerView({model: this.model}) 
    var html = timer.render().el
    $('#bomb', this.el).html(html)


    $('body').append('<div class="modal-backdrop" />')
    $('#notification').html(this.el)
    $(this.el).animate({ top: '50'})
    if(this.shouldFadeOut)
      this.fadeOut() 
    return this
  },

  close: function() {
    $('.modal-backdrop').fadeOut('slow', function() {
      $(this.el).remove();
     });

    $(this.el).fadeOut('slow', function() {
      $(this).remove();
     });
   }
})


});

