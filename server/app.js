const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
//own modules
//all pages
const home = require('./routes/home.js');
const join = require('./routes/joinLobby.js');
const create = require('./routes/createLobby.js');
const gameHost = require('./routes/gameHost.js');
const player1 = require('./routes/player1.js');
const player2 = require('./routes/player2.js');

//sockets
const sockets = require('./sockets.js');

const routerSettings = {
  init: function(){
    this.basicSettings();
    this.configureRoutes();
  },
  basicSettings: function(){
    http.listen(3000, function () {
      console.log('server is running on port 3000');
    });
    app.use(express.static('public'));
    app.set('view engine', 'ejs');
    app.set('views', 'src/views');
    sockets.init(io);
  },
  configureRoutes: function(){

    app.use('/', home);
    app.use('/lobby/join', join);
    app.use('/lobby/create', create);
    app.use('/game/host/:id', gameHost);
    app.use('/game/player1/:id', player1);
    app.use('/game/player2/:id', player2);
  }
};

routerSettings.init();
