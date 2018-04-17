const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//own modules
//all pages
const home = require('./routes/home.js');

//sockets
const sockets = require('./sockets.js');

const routerSettings = {
  init: function(){
    this.basicSettings();
    this.configureRoutes();
  },
  basicSettings: function(){
    http.listen(1337, function () {
      console.log('server is running on port 1337');
    });
    app.use(express.static('public'));
    app.set('view engine', 'ejs');
    app.set('views', 'src/views');
    sockets.init(io);
  },
  configureRoutes: function(){

    app.use('/', home);
  }
};

routerSettings.init();
