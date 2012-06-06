define(function(require) {

var SignupView = require('views/users/signup')
  , homeTpl = require('text!templates/home.mustache')
  , LoginView = require('views/users/login')         
  , SubjectsNav = require('views/subjects_nav')
  , WishesView = require('views/wishes/wishes')
  , Wishes = require('collections/wishes')
  , Subjects = require('collections/subjects')
  , Subject = require('models/subject')
  , StackConvos = require('views/stackConvos')
  , SingleConvo = require('views/singleConvo')
  , MessageView = require('views/message')
  , WishView = require('views/wish')
  , ProfileView = require('views/users/profile')
  , ProfileEditView = require('views/users/profile-edit')
  , ContextualMenuView = require('views/contextual-menu')

function showStatic(path) {
  $.get(path, function(obj) {
    $('#app').html(obj.body);
     document.title = obj.title;
  });
}

var alreadyLoggedIn = function(callback) { 
  if (window.user.isLoggedIn()) 
    return this.navigate('/', true)
  callback.apply(this, Array.prototype.slice.call(arguments,1)); 
}

var restrict = function(callback) { 
  if (!window.user.isLoggedIn()) 
    return this.navigate('/login', true)
  callback.apply(this, Array.prototype.slice.call(arguments,1)); 
}

function autoResetRouter(){ 
  _(this.routes).each(function(destination) {
    _(this.routes).each(function(other) {
      if (destination === other) return;
      // route:x => reset_y
      if(_.has(this, 'reset_'+other))
        this.bind('route:'+destination, this['reset_'+other]);
    }, this);
  }, this);
}

return Backbone.Router.extend({

  initialize: function() {
    _.bindAll(this); 
    this.on('all', this.highlight)
    this.on('all', this.reset)
    //autoResetRouter.call(this)
    window.dispatcher.on('session:logout', this.logout, this)
    this.router = new Backbone.Router()
  },

  routes: {
      'signup':                     'signup'
    , 'login':                      'login'
    , 'profile/:username':          'profile'
    , 'profile/:username/edit':     'profile_edit'
    , 'wishes':                     'wishes' 
    , 'wishes/:id':                 'wish' 
    , 'subjects/:id':               'subject'
    , '*actions':                   'home'
    //'*actions': his    'defaultAction'
  },
  
  reset: function(route, section) {
    route = route.replace('route:', '');
    if(this.prev_route)
      if(_.has(this, 'reset_'+this.prev_route)){
        var path = 'reset_'+this.prev_route 
        this[path]()
      }
    this.prev_route = route
  },

  home: function() { 
    if (window.user.isLoggedIn())
      return this.subjects()
    var template = Hogan.compile(homeTpl)
    $('#app').html(template.render())
    document.title = 'Ruby Rate' 
  },

  subjects: function(){
    this.wishNavIsSet = true
    $.get('/subjects', function(res) {
      var view = new SubjectsNav()
      $('#app').html(view.render(res));
      document.title = 'Topics';
    });
  },

  subject: function(id) {
    if (!this.wishNavIsSet)
      return this.router.navigate('subjects', {trigger: true})
    var that = this
    $.get('/subjects/'+id, function(res) {
      if (res.single_convo)
        var view = new SingleConvo(res.conversations)
      else 
        var view = new StackConvos(res.conversations)
      var header = new MessageView(res.subject)
      var header_html = header.render().el
      $('#conversations #header').html(header_html)
      $('#conversations #body').html(view.render().el);
      document.title = 'Ruby Rate';
    });
  },

  'wishes': function(e) {
    var that = this
    var collection = new Wishes()
    collection.fetch({success: function(collection, res){
      $('body').addClass('no-app')
      var view = new WishesView({collection: collection})
      $('#app').html(view.render().el);
      document.title = 'Wishes';
    }})
  },

  'reset_wishes': function(){
    $('body').removeClass('no-app')
  },

  'wish': function(id) {
    var that = this
    $.get('/wishes/'+id, function(res) {
      var view = new WishView({subject: res.subject, replies: res.replies})
      $('#app').html(view.render().el);
      document.title = 'Ruby Rate';
    });
  },

  contextualMenu: function(model){
    if (window.user.isLoggedIn()){ 
      this.contextualMenuView = new ContextualMenuView()
      var template = this.contextualMenuView.render().el
      $('.nav.main-menu').after(template)
    }
  },

  profile: function(username){
    $('body').addClass('no-app')
    this.contextualMenu() 
    $.get('/profile/'+username, function(user) {
      var view = new ProfileView()
      $('#app').html(view.render(user).el)
      document.title = 'user.username' + 'on Rubyrate'
    })
  },

  'reset_profile': function(){
    $('body').removeClass('no-app')
    if (this.contextualMenuView)
      this.contextualMenuView.remove()
  },

  profile_edit: function(username){
    $('body').addClass('no-app')
    $.get('/profile/'+username+'/edit', function(user) {
      var view = new ProfileEditView()
      $('#app').html(view.render(user).el)
      document.title = 'user.username' + 'on Rubyrate'
    })
  },

  'reset_profile': function(){
    $('body').removeClass('no-app')
  },

  login: _.wrap(function(){
    this.loginView = new LoginView({context: 'main'})
    this.loginView.render()
    $('#app').html(this.loginView.el)
    document.title = 'Login'
  }, alreadyLoggedIn),

  signup: _.wrap(function(){ 
    this.signupView = new SignupView({context: 'main'})
    this.signupView.render();
    $('#app').html(this.signupView.el)
    document.title = 'Sign Up'
  }, alreadyLoggedIn),

  logout: function(){
    console.log('router.logout.on->session:logout')
    $.ajax({
      type: "DELETE",
      url: "/session",
      success: function(){
        window.user.clear(); 
        var router = new Backbone.Router();
        router.navigate('login', {trigger: true})
      }
    })
  },

  highlight: function(route, section) {
    route = route.replace('route:', '/');
    if (route === '/home') route = '/' 
    var hrefString = "a[href='" + route + "']"
    var el = $(hrefString, '.navbar');
    if (el.parent().hasClass('active')) return
    else {
      $('.navbar li.active').removeClass('active');
      var parent = el.parent(); 
      if (route== '/') return 
      parent.addClass('active');
    }
  }

});
});
