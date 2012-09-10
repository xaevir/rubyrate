define(function(require) {

var tpl  = '<div class="wrapper {{wrapperClass}}">'
    tpl += '<div class="content {{type}}">'
    tpl += '<a class="close" href="#">×</a>'
    tpl += '{{{message}}}</div></div>'

return Backbone.View.extend({

  template: Hogan.compile(tpl),

  id: 'alert',

  events: { 
    'click .close' : 'close'
  },

  initialize: function(options){
    _.bindAll(this) 
    if (_.isObject(options)) {
      this.message = options.message
      this.container = options.container
      this.doNotFadeOut = options.doNotFadeOut
      this.type = options.type
      this.duration = options.duration
      this.wrapperClass = options.wrapperClass
      this.doNotStickAround = options.doNotStickAround
      this.bgOpacity = options.bgOpacity
    } else {
      this.message = options 
    }
    this.render() 
  },

  render: function(){
    var template = this.template.render({
      message: this.message, 
      type: this.type,
      wrapperClass: this.wrapperClass
    })
    $(this.el).html(template)
    if (this.bgOpacity)
      $('body').append('<div class="modal-backdrop" />')
    if (this.doNotStickAround)
      $('#app').prepend(this.el)
    else 
      $('body').prepend(this.el)
    $(this.el).animate({ top: '50'})
    if (!this.doNotFadeOut)
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
  
  close: function(){
    $('.modal-backdrop').fadeOut('slow', function() {
      $(this.el).remove();
     });

    $(this.el).fadeOut('slow', function() {
      $(this.el).remove();
     });
  }

});

});
