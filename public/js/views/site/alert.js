define(function(require) {

var tpl = '<div class="content {{type}}">\
                  {{{message}}}\
                </div>'

var tplError = '<div class="content error">\
                  {{{message}}}\
                </div>'


var alerts = {} 

alerts.alert = Backbone.View.extend({
  
  id: 'alert',

  template: Hogan.compile(tpl),

  shouldFadeOut: true,

  initialize: function(message){
    _.bindAll(this) 
    if (_.isObject(message)) {
      this.message = message.message
      this.type = message.type
      this.duration = message.duration
    } else {
      this.message = message
    }
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

  id: 'containedAlert',

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


return alerts

});
