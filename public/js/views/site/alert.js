define(function(require) {

var tplAlert = '<div class="content">\
                  {{{message}}}\
                </div>'

var tplError = '<div class="content error">\
                  {{{message}}}\
                </div>'

var tpl  = '<div class="wrapper {{wrapperClass}}">'
    tpl += '<div class="content {{type}}">'
    tpl += '<a class="close" href="#">×</a>'
    tpl += '{{{message}}}</div></div>'

var alerts = {} 

alerts.alert = Backbone.View.extend({
  
  id: 'alert',

  template: Hogan.compile(tplAlert),

  shouldFadeOut: true,

  initialize: function(message){
    _.bindAll(this) 
    this.message = message
    this.render()
  },

  render: function(){
    var template = this.template.render({
      message: this.message, 
    })
    $(this.el).html(template)
    $('#notification').html(this.el)
    $(this.el).animate({ top: '50'})
    if(this.shouldFadeOut)
      this.fadeOut() 
    return this
  },

  fadeOut: function(){
   var self = this
   var duration = this.duration || 3000
   var t = setTimeout(function(){
    $(self.el).fadeOut('slow', function() {
      $(self.el).remove();
     });
    }, duration);
  },

});


alerts.error = alerts.alert.extend({
  template: Hogan.compile(tplError),
  shouldFadeOut: false,
})


alerts.contained = Backbone.View.extend({

  id: 'alert',

  template: Hogan.compile(tplError),

  initialize: function(message){
    _.bindAll(this) 
    this.message = message
  },

  render: function(){
    var template = this.template.render({
      message: this.message, 
    })
    $(this.el).html(template)
    return this
  },
})

alerts.instructions = alerts.alert.extend({

  events: { 
    'click .close' : 'close'
  },

  className: 'instructions',

  initialize: function(message){
    _.bindAll(this) 
    this.message = message
    this.globalEvent()
  },

  globalEvent: function(){
    var func = _.bind(this.close, this)
    $('body').click(function(){
      func() 
    });
  },

  render: function() {
    var template = this.template.render({
      message: this.message, 
    })
    $(this.el).html(template)
    $('#notification').html(this.el)
    $(this.el).animate({ top: '50'})
    $('body').append('<div class="modal-backdrop" />')
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

return alerts

});
