Backbone = require('backbone')
_ = require('underscore')
var Validation = require('../public/js/libs/backbone.validation/backbone.validation')
_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

var User = require('../public/js/models/user')

module.exports = User

