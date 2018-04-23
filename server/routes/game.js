const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
  res.render('game.ejs', {data: ''});
});

module.exports = router;
