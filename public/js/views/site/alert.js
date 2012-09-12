define(function(require) {

var tpl  = '<div class="wrapper {{wrapperClass}}">'
    tpl += '<div class="content {{type}}">'
    tpl += '<a class="close" href="#">×</a>'
    tpl += '{{{message}}}</div></div>'

var alerts = {} 

alerts.main = Backbone.View.extend({

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
      this.type = options.type
      this.duration = options.duration
      this.wrapperClass = options.wrapperClass
      this.element = options.element
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
    if(this.element)
      $(this.element).prepend(this.el)
    else
      $('body').prepend(this.el)
    $(this.el).animate({ top: '50'})
    this.fadeOut() 
    return this
  },

  addToDom: function(){
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

alerts.instructions = alerts.main.extend({

  className: 'instructions',

  initialize: function(message){
    _.bindAll(this) 
    this.message = message
    this.globalEvent()
    this.render()
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
    $('body').prepend(this.el)
    $(this.el).animate({ top: '50'})
    $('body').append('<div class="modal-backdrop" />')
    return this
  },

  close: function(){
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
