var express = require('express');
var router = express.Router();
var UserDao = require('../dao/UserDao');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = req.params || req.query;
  var userDao = new UserDao(params.name);
  userDao.insert();
  res.send('respond with a resource');
});

module.exports = router;
