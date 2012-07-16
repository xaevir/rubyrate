
/*
 * GET home page.
 */

exports.spider = function(req, res){
  db.users.findOne({username: 'xaevir'}, function(err, user) {
    res.send(user)
  })
};

