const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
  res.render('player1.ejs', {data: ''});
});

module.exports = router;
