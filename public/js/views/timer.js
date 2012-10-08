define(function(require) {

return  Backbone.View.extend({

  className: 'timer',  

  totalSeconds: 60,

  initialize: function(options) {
    _.bindAll(this);
    var self = this
    window.setTimeout(function(){self.tick()}, 1000);
  },

  tick: function() {
    this.totalSeconds -= 1;
    this.render() 
    var self = this
    window.setTimeout(function(){self.tick()}, 1000);
  },

  render: function() {
    var html = this.totalSeconds+' time till expires'
    this.$el.html(html)
    return this
  },
  
})

})
