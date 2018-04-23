const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
  res.render('gameHost.ejs', {data: ''});
});

module.exports = router;
