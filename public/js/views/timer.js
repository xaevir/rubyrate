define(function(require) {

return  Backbone.View.extend({

  className: 'timer',  

  initialize: function(options) {
    _.bindAll(this);
    var self = this
    this.setupTotalSeconds()
    window.setTimeout(function(){self.tick()}, 1000);
  },

  setupTotalSeconds: function(){
    var created = new Date(parseInt(this.model.id.slice(0,8), 16)*1000)
      , timeUp = new Date(created)
      , now = new Date()
    switch (this.model.get('when')) {
      case '1 hour':
        timeUp.setHours(timeUp.getHours()+1);
        break;
      case '2 hours':
        timeUp.setHours(timeUp.getHours()+2);
        break;
      case 'less than 5 hours':
        timeUp.setHours(timeUp.getHours()+5);
        break;
      case '24 hours':
        timeUp.setHours(timeUp.getHours()+24);
        break;
      case '48 hours':
        timeUp.setHours(timeUp.getHours()+24);
        break;
    }
    
    if (timeUp > now) {
      var milliseconds = timeUp - now  // difference in milliseconds
      this.totalSeconds =  Math.floor(milliseconds / 1000)
    }
    else {
      this.totalSeconds = 0 
    }
  },

  tick: function() {
    if (this.totalSeconds <= 0) {
      this.renderTimesUp()
      return;
    }
    this.totalSeconds -= 1;
    this.render() 
    var self = this
    window.setTimeout(function(){self.tick()}, 1000);
  },

  updateTimer: function() {
    var Seconds = this.totalSeconds;
    
    var Days = Math.floor(Seconds / 86400);
    Seconds -= Days * 86400;

    var Hours = Math.floor(Seconds / 3600);
    Seconds -= Hours * (3600);

    var Minutes = Math.floor(Seconds / 60);
    Seconds -= Minutes * (60);

    this.timeStr = ((Days > 0) ? Days + " days " : "") + this.leadingZero(Hours) + ":" + this.leadingZero(Minutes) + ":" + this.leadingZero(Seconds)
  },

  leadingZero: function(Time) {
    return (Time < 10) ? "0" + Time : + Time;
  },

  render: function() {
    this.updateTimer()
    //var html = this.totalSeconds+' time left'
    this.$el.html(this.timeStr)
    return this
  },
 
  renderTimesUp: function(){
    this.$el.html('Times Up!')
  }

})

})
