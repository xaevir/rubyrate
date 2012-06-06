
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , cons = require('consolidate')
  , RedisStore = require('connect-redis')(express)
  , mongo = require('mongoskin')
  , ObjectID = mongo.ObjectID
  , bcrypt = require('bcrypt')
  , imagemagick = require('imagemagick')
  , check = require('validator').check
  , _ = require('underscore')

var staticServer = express.static(__dirname + '/public')
var app = express();

app.engine('mustache', cons.hogan);

app.configure(function(){
  app.set('views', __dirname + '/pages');
  app.set('view engine', 'mustache');
  app.set('view options', { layout: false });
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('robin'));
  app.use(express.session({ secret: "batman", store: new RedisStore }));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
  db = mongo.db('localhost/dev_ruby?auto_reconnect');
});

app.configure('production', function(){
  db = mongo.db('localhost/rubyrate?auto_reconnect');
})

db.bind('messages')
db.bind('subjects')
db.bind('users')

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

function getUser(session){
  var user = false 
  if (session.user) {
    user = {
      username: session.user.username, 
      _id:  session.user._id
    }
    user = JSON.stringify(user)
  }
  return user
}

/* redirect from www */
app.get('/*', function(req, res, next) {
  if (req.headers.host.match(/^www/) !== null ) {
    var new_url = 'http://' + req.headers.host.replace(/^www\./, '') + req.url
    res.redirect(301, new_url);
  }
  else next();
});

app.get('/css/*', function(req, res, next) {
  staticServer(req, res, next)  
})

app.get('/js/*', function(req, res, next) {
  staticServer(req, res, next)  
})

app.get('/img/*', function(req, res, next) {
  staticServer(req, res, next)  
})

app.get('/fonts/*', function(req, res, next) {
  staticServer(req, res, next)  
})

/* force xhr */
app.get('/*', function(req, res, next) { 
  if (!(req.xhr)) 
    res.render('layout', {user: getUser(req.session), year: new Date().getFullYear()})
  else 
    next()
})

app.get('/', function(req, res) {
  res.render('home', function(err, html){
    res.send({title: 'Ruby Rate', body: html});
  });
})

app.post('/session', function(req, res) {
  var key
  var spec = {}
  try {
    check(req.body.login).isEmail()
    key = 'email'
  } catch(e) {
    key = 'username'
  }
  spec[key] = req.body.login  

  db.collection('users').findOne(spec, function(err, user){
    if (!user)
      return res.send({message: 'user not found'});
    bcrypt.compare(req.body.password, user.password, function(err, match) {
      if (!match) 
        return res.send({message: 'user not found'});
      req.session.user = user;
      user.password = '';
      res.send(user)
    })
  })
})

app.del('/session', function(req, res) {
  req.session.destroy(function(){
    res.send({success: true, 
              message: 'user logged out'
    })
  })
})

app.get('/signup', function(req, res) { });

app.post('/signup', function(req, res){ 
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash){
      req.body.password = hash;
      db.collection('users').insert(req.body, function(err, result){
        var user = result[0]
        req.session.user = user;
        user.password = '';
        res.send(user);
      })
    })
  }) 
})

app.get("/is-username-valid", function(req, res) {
  db.collection('users').findOne({username: req.body.username}, function(err, user){
    return user 
      ? res.send(false) 
      : res.send(true);
  })
})

app.get("/check-email", function(req, res){
  db.collection('users').findOne({email: req.body.email}, function(err, user){
    return user
      ? res.send(false)
      : res.send(true);
  })
})

app.get('/profile/:username', function(req, res) {
  db.users.findOne({username: req.params.username}, {password: 0}, function(err, user) {
    res.send(user)
  })
})


app.get('/profile/:username/edit', restrict, function(req, res) {
  var username = req.session.user.username
  db.users.findOne({username: username}, {password: 0}, function(err, user) {
    res.send(user)
  })
})

app.post('/profile', restrict, function(req, res) {
  var username = req.session.user.username
  db.users.update({username: username}, {$set: req.body})
  res.send({success: false, message: 'user updated'})
})

app.get('/wishes', function(req, res) {
  db.collection('subjects').find().toArray(function(err, result) {
      if (err) throw err;
      res.send(result)
  })
})

app.post('/wishes', restrict, function(req, res) {
  // TODO validate wish 
  var username = req.session.user.username
  req.body.author = username
  req.body.users = [{
    username: username, 
  }]
  db.collection('subjects').insert(req.body, function(err, id){
    if (err) throw err;
    res.send({success: true, message: 'wish inserted'})
  })
});

app.get('/wishes/:id', function(req, res) {
  db.subjects.findOne({_id: new ObjectID(req.params.id)}, function(err, subject) {
    db.messages.find({subject_id: req.params.id}).toArray(function(err, replies) {
      if (err) throw err;
      res.send({
        subject: subject, 
        replies: replies
      })
    })
  })
})


app.get('/subjects/:id', restrict, function(req, res) {
  // check authorized first 
  var username = req.session.user.username

  // reset unread
  db.subjects.update(
    {_id: new ObjectID(req.params.id), 'users.username': username }, 
    {$set: {'users.$.unread': 0}}
  ) 
  var query =  {
    _id: new ObjectID(req.params.id), 
    'users.username': username 
  }
  db.subjects.findOne(query, function(err, subject) {
      if (err) throw err;
      // TODO test this following authorization
      if (!subject)
        res.send({success: false, message: 'user unauthorized'})
      if (username == subject.author) {

        function map() {
          var values = {comments: new Array(this), count: 1}
          emit(this.convo_id, values);        
        }
        //var map = function() {
        //} 

        var reduce = function(key, values) {
          var result = {comments: new Array(), count: 0};
          values.forEach(function(value) {
            result.count += value.count;
            if (value.comments.length > 0)
              result.comments = result.comments.concat(value.comments);
            else
              result.comments.push(value.comments[0]) 
          });
          return result;
        }

        var options = {
          "query": {subject_id: req.params.id}, 
          "sort": {_id: 1 },
          "out" : {replace : 'tempCollection'},
        };

        db.messages.mapReduce(map, reduce, options, function(err, collection) {
          collection.find().toArray(function(err, conversations) {
              if (err) throw err;
              res.send({subject: subject, conversations: conversations})
          })
        })
      }

      else {
        var user = _.find(subject.users, function(user){ return user.username == username });

        db.messages.find({convo_id: user.convo_id}).toArray(function(err, conversations) {
          if (err) throw err;
          res.send({
            subject: subject, 
            single_convo: true, 
            conversations: conversations
          })
        })
      }
  })
})

app.get('/subjects', restrict, function(req, res) {
  var username = req.session.user.username
  db.subjects.find({'users.username': username}).toArray(function(err, subjects) {
    var arr = new Array()
    _.each(subjects, function(subject) {
      var user = _.find(subject.users, function(user){ return user.username == username })
      delete subject.users 
      subject.total = user.total
      subject.unread = user.unread
      arr.push(subject)
    });
    res.send(arr)
  })
})

app.post('/first-reply/:id', restrict, function(req, res) {
  var username = req.session.user.username
  var convo_id = new ObjectID().toString()

  var user = {
    username: username, 
    convo_id: convo_id,
    total: 1
  } 

  db.subjects.update({_id: new ObjectID(req.params.id)}, {$push: {users: user}}) 
  db.subjects.update({_id: new ObjectID(req.params.id)}, {$inc: {'users.0.unread': 1, 'users.0.total': 1}}) 

  var message = req.body 
  message.convo_id = convo_id
  message.author = username
  message.subject_id = req.params.id
  message.first = true 
  db.messages.insert(message, function(err, message){
    if (err) throw err;
    res.send({success: true, message: 'message inserted', data: message})
  })
})

app.post('/reply/:convo_id', restrict, function(req, res) {
  var username = req.session.user.username
    , msg = req.body
    , convo_id = req.params.convo_id

  msg.convo_id = convo_id
  msg.author = username
  db.messages.insert(req.body, function(err, msg){
    if (err) throw err;
    res.send({success: true, message: 'message inserted', data: msg})
  })
  
  db.subjects.findOne({_id: new ObjectID(msg.subject_id)}, function(err, subject){
    var to = _.find(subject.users, function(user){ return user.convo_id == convo_id })
    if (subject.author == username) {
      db.subjects.update(
        {_id: new ObjectID(msg.subject_id), 'users.username': to.username }, 
        {$inc: {'users.$.unread': 1, 'users.$.total': 1, 'users.0.total': 1}}
      ) 
    } else {
      db.subjects.update(
        {_id: new ObjectID(msg.subject_id), 'users.username': to.username}, 
        {$inc: {'users.0.unread': 1, 'users.0.total': 1, 'users.$.total': 1}}
      )   
    }
  })
/*
    if author is me, send to person matching the convo_id
    i'm = 'xaevir' 
    author = 'xaevir' 
    users = [
      {username: 'jen',
       convo_id: 12334
      } 
    ] 
    if author is not me, send to author
    i'm = 'jen' 
    author = 'xaevir' 
    users = [
      {username: 'xaevir',
      },
      {username: 'jen',
       convo_id: 12334
      }
    ]
*/  
})

http.createServer(app).listen(8010);

console.log("Express server listening on port 3000");
