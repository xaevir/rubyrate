define(function(require) {
  require('order!libs/jquery/jquery-min')  
//  require('order!libs/socket.io/socket.io')  
  require('order!libs/underscore/underscore')
  require('order!libs/backbone/backbone')
  require('order!libs/backbone.validation/backbone.validation')
  require('order!libs/utilities')
  require('order!libs/hogan.js/web/builds/2.0.0/hogan-2.0.0')
  require('order!libs/bootstrap/js/bootstrap-dropdown')
  require('order!libs/bootstrap/js/bootstrap-modal')
  require('order!libs/bootstrap/js/bootstrap-tab')
  require('order!libs/bootstrap/js/bootstrap-alert')
  require('order!libs/jquery-iframe-transport/jquery.iframe-transport')  
  require('order!libs/bootstrap-wysihtml5/lib/js/wysihtml5-0.3.0')  
  require('order!libs/bootstrap-wysihtml5/src/bootstrap-wysihtml5')  
  require('order!libs/jquery-color/jquery.color')  
  require('order!libs/modernizr')  

  var App = require('order!app')
                                                
  $.ajaxSetup({ cache: false });
  App.initialize();
  
})
