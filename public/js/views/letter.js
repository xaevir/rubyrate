define(function(require) {

var tpl = '<div class="content">\
            <a class="close" href="#">×</a>{{{message}}}\
           </div>'

return Backbone.View.extend({

  id: 'letter',

  template: Hogan.compile(tpl),

  initialize: function(message){
    _.bindAll(this) 
    this.globalEvent()
    this.message = message
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
    var template = this.template.render({
      message: this.message, 
    })
    $(this.el).html(template)
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

