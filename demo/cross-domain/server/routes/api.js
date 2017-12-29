var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/jsonp', function(req, res, next) {
  res.jsonp({result: 'hello world'});
});

module.exports = router;
