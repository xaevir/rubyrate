define(function(require) {

var ReplyView = require('views/reply')

return ReplyView.extend({

  xhr_callback: function(res) {
    this.render()
    this.showMessage()
    this.collection.add(res.data); 
  },

})

})
