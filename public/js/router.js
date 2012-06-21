define(function(require) {

var SignupView = require('views/users/signup')
  , homeTpl = require('text!templates/home.mustache')
  , LoginView = require('views/users/login')         
  , SubjectsNav = require('views/subjects_nav')
  , Wishes = require('collections/wishes')
  , Subjects = require('collections/subjects')
  , Subject = require('models/subject')
  , ChatColumns = require('views/chatColumns')
  , MessageBodyView = require('views/messageBody')
  , MessagesView = require('views/messages')
  , ProfileView = require('views/users/profile')
  , ProfileEditView = require('views/users/profile-edit')
  , ProfileMenuView = require('views/profile-menu')
  , WishSetupView = require('views/wishes/setup')
  , ChatCompositeView = require('views/chatComposite')         
  , ReplyView = require('views/reply')
  , instructionsTpl = require('text!templates/instructions.mustache')

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

var rp = Backbone.Router.prototype
var _route = rp.route;
rp.route = function(route, name, callback) {
  return _route.call(this, route, name, function() {
    //this.trigger.apply(this, ['beforeroute:' + name].concat(_.toArray(arguments)));
    this.reset(name)
    callback.apply(this, arguments);
  });
};

/*
var rp = Backbone.Router.prototype
rp.routeWithoutEvents = rp.route
rp.route = function(route, name, handler){
  var that = this
  this.routeWithoutEvents(route, name, function(){
    that.trigger("route:before")
    handler()
    that.trigger("route:after")
  })
}
*/

return Backbone.Router.extend({

  initialize: function() {
    _.bindAll(this); 
    this.on('all', this.highlight)
    this.getUser()
    window.events = _.clone(Backbone.Events)
    window.dispatcher.on('session:logout', this.logout, this)
    this.router = new Backbone.Router()

    events.on("messageAdded-Reply.js", function(chatCompositeView, message) {
      chatCompositeView.messagesView.addOne(message)
    }); 
  },

  routes: {
      'signup':                     'signup'
    , 'login':                      'login'
    , 'profile/:username':          'profile'
    , 'profile/:username/edit':     'profile_edit'
    , 'wishes':                     'wishes' 
    , 'wishes/:id':                 'wish' 
    , 'helper/:id':                 'helper' 
    , 'wishes/:id/setup':           'wish_setup' 
    , 'subjects':                   'subjects'
    , 'subjects/:id':               'subject'
    , '*actions':                   'home'
    , 'admin':                      'admin'
    //'*actions': his    'defaultAction'
  },
 
  getUser: function(){
    $.ajax({ 
      url: "/user", 
      async: false, 
      success: function(user) {   
        if (user) window.user.set(user)
      }
    });
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
    //if (window.user.isLoggedIn())
    //  return this.subjects()
    var template = Hogan.compile(homeTpl)
    $('#app').html(template.render())
    pSUPERFLY.virtualPage("/home", "Home");
    document.title = 'Ruby Rate' 
  },

  subjects: function(){
    $('body').addClass('app')
    this.wishNavIsSet = true
    $.get('/subjects', function(res) {
      var view = new SubjectsNav()
      $('#app').html(view.render(res));
      document.title = 'Topics';
    });
  },

  'reset_subjects': function(){
    $('body').removeClass('app')
  },

  subject: function(id) {
    $('body').addClass('app')
    if (!this.wishNavIsSet)
      return this.router.navigate('subjects', {trigger: true})
    var that = this
    $.get('/subjects/'+id, function(res) {
      // header
      var header = new MessageBodyView({message: res.subject, tagName: 'h1'})
      var header_html = header.render().el
      $('#conversations #header').html(header_html)

      // body
      var views = []
      _.each(res.conversations, function(convo){
        var chatCompositeView = new ChatCompositeView()
        chatCompositeView.messagesView = new MessagesView({messagesOfChat: convo.value.comments})
        var opts = {
          convo_id: convo._id,
          subject_id: convo.value.comments[0].subject_id,
          parentView: chatCompositeView
        }
        chatCompositeView.replyView = new ReplyView(opts)
        views.push(chatCompositeView);
     }, this);
      var view = new ChatColumns({views: views, columns: 2})
      $('#conversations #body').html(view.render().el);
      document.title = 'Ruby Rate';
    });
  },

  'reset_subject': function(){
    $('body').removeClass('app')
  },

  'wishes': function(e) {
    var hi = pSUPERFLY
    $.get('/wishes', function(wishes) {
      var views = []
      _.each(wishes, function(wish){
        var subject_id = wish[0]._id
        var chatCompositeView = new ChatCompositeView()
        chatCompositeView.messagesView = new MessagesView({messagesOfChat: wish, truncate: 200})
        chatCompositeView.replyView = new ReplyView({subject_id: subject_id, parentView: chatCompositeView, context: 'wish'})
        $(chatCompositeView.el).prepend('<a class="view-reply" href="/wishes/' + subject_id + '">view replies</a>')
        // change to user.role =admin

        views.push(chatCompositeView);
     }, this);
      var view = new ChatColumns({views: views})
      var html =  view.render().el
      $('#app').html(html);
      pSUPERFLY.virtualPage("/wishes", "Wishes");
      document.title = 'Wishes';
    });
  },

  'wish': function(id) {
    $('body').attr('id','wish')
    var that = this
    $.get('/wishes/'+id, function(res) {
      // header
      var header = new MessageBodyView({message: res.subject, tagName: 'h1'})
      $('#app').html(header.render().el);
      // body
      var views = []
      _.each(res.conversations, function(convo){
        var chatCompositeView = new ChatCompositeView({noReply: true})
        chatCompositeView.messagesView = new MessagesView({messagesOfChat: convo.value.comments})
        var opts = {
          convo_id: convo._id,
          subject_id: convo.value.comments[0].subject_id,
          parentView: chatCompositeView
        }
        chatCompositeView.replyView = new ReplyView(opts)
        views.push(chatCompositeView);
     }, this);
      var view = new ChatColumns({views: views, columns: 2, span: 6})
      var html =  view.render().el
      $('#app').append(html);
      pSUPERFLY.virtualPage("/wishes/" + res.subject._id, res.subject.body);
      document.title = 'Wish';
    });
  },

  'reset_wish': function(){
    $('body').removeAttr('id')
  },

  'helper': function(id) {
    var self = this
    $('body').attr('id','wish')
    $.get('/helper/'+id, function(res) {
      self.getUser()
      // Instructions
      var template = Hogan.compile(instructionsTpl)
      $('#app').html(template.render());

      // header
      var header = '<h2 style="float:left;margin-right: 10px">Your wish was:</h2><h1>'+ res.subject.body+'</h1>'
      $('#app').append(header);
      // body
      var views = []
      _.each(res.conversations, function(convo){
        var chatCompositeView = new ChatCompositeView()
        chatCompositeView.messagesView = new MessagesView({messagesOfChat: convo.value.comments})
        var opts = {
          convo_id: convo._id,
          subject_id: convo.value.comments[0].subject_id,
          parentView: chatCompositeView
        }
        chatCompositeView.replyView = new ReplyView(opts)
        views.push(chatCompositeView);
     }, this);
      var view = new ChatColumns({views: views, columns: 2, span: 6})
      var html =  view.render().el
      $('#app').append(html);
      pSUPERFLY.virtualPage("/helper/" + res.subject._id, res.subject.body);
      document.title = 'Wish';
    });
  },

  'reset_helper': function(){
    $('body').removeAttr('id')
  },


  'wish_setup': function(id) {
    $.get('/wishes/'+id+'/setup', function(res) {
      // header
      var wishHeader = new MessageBodyView({message: res.wish, tagName: 'h1'})
      $('#app').html(wishHeader.render().el);

      // body
      var view = new WishSetupView(res)
      $('#app').append(view.render().el);

      document.title = 'Ruby Rate';
    });

  },

  profileMenu: function(userSlug){
    if (window.user.isLoggedIn()){ 
      if (window.user.get('slug') == userSlug){
        this.profileMenuView = new ProfileMenuView()
        var template = this.profileMenuView.render().el
        $('#main-menu').after(template)
      }
    }
  },

  profile: function(userSlug){
    this.profileMenu(userSlug) 
    $.get('/profile/'+userSlug, function(user) {
      var view = new ProfileView(user)
      $('#app').html(view.render(user).el)
      pSUPERFLY.virtualPage("/profile/" + user.slug, 'Profile for '+user.username);
      document.title = user.username + ' on Rubyrate'
    })
  },

  'reset_profile': function(){
    if (this.profileMenuView)
      this.profileMenuView.remove()
  },

  profile_edit: function(username){
    $.get('/profile/'+username+'/edit', function(user) {
      var view = new ProfileEditView()
      $('#app').html(view.render(user).el)
      pSUPERFLY.virtualPage('/profile/'+user.slug+'/edit', 'Edit profile for '+user.username);
      document.title = 'Editing '+user.username+ ' on Rubyrate'
    })
  },

  login: _.wrap(function(){
    this.loginView = new LoginView({context: 'main'})
    this.loginView.render()
    $('#app').html(this.loginView.el)
    document.title = 'Login'
    pSUPERFLY.virtualPage('/login', 'Login');
  }, alreadyLoggedIn),

  signup: _.wrap(function(){ 
    this.signupView = new SignupView({context: 'main'})
    this.signupView.render();
    $('#app').html(this.signupView.el)
    document.title = 'Sign Up'
    pSUPERFLY.virtualPage('/signup', 'SignUp');
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
