const sockets = {
  init: function(io){
    this.create(io);
    this.party(io);
  },
  rooms: [],
  gameRooms: [],
  games: [],
  create: function(io){
    //all create a lobby sockets
    let self = this;
    io.on('connection', function(socket){
      io.to(socket.id).emit('connected', socket.id);
      socket.on('newRoom', function(){
        let number = self.createRoomNumber(socket.id);
        io.emit('yourRoom', number);
        io.emit('viewRooms', self.rooms);
      });
      socket.on('viewRooms', function(){
        io.emit('viewRooms', self.rooms);
      });

      socket.on('joinRoom', function(room){
        for(let i = 0; i < self.rooms.length; i++){
          if(self.rooms[i].roomNumber === room){
            let player = 0;
            if(self.rooms[i].players.length < 1){
              player = 1;
            }
            else if(self.rooms[i].players.length < 2){
              if(self.rooms[i].players[0].user !== socket.id){
                if(self.rooms[i].players[0].player === 2){
                  player = 1;
                }
                else{
                  player = 2;
                }
              }
            }
            else{
              io.to(socket.id).emit('roomFull');
            }
            if(player > 0){
              if(self.rooms[i].roomNumber == room){
                let obj = {
                  user: socket.id,
                  player: player
                };
                self.rooms[i].players.push(obj);
              }
              io.emit('joinedRoom', self.rooms[i]);
            }
          }
        }
      });
      socket.on('disconnect', function(){
        for(let i = 0; i < self.rooms.length; i++){
          if(self.rooms[i].host == socket.id){
            io.emit('hostDisconnected', self.rooms[i]);
            self.rooms.splice(i, 1);
          }
          else{
            for(let k = 0; k < self.rooms[i].players.length; k++){
              if(self.rooms[i].players[k].user === socket.id){
                self.rooms[i].players.splice(k, 1);
                io.emit('joinedRoom', self.rooms[i]);
              }
            }
          }
        }
        io.emit('viewRooms', self.rooms);
      });
      socket.on('startGame', function(id){
        for(let i = 0; i < self.rooms.length; i++){
          if(self.rooms[i].host === id){
            io.to(id).emit('startGameHost', self.rooms[i]);
            for(let k = 0; k < self.rooms[i].players.length; k++){
              io.to(self.rooms[i].players[k].user).emit('startGame', self.rooms[i]);
            }
            self.gameRooms.push(self.rooms[i].roomNumber);
          }
        }
      });
    });
  },
  createRoomNumber: function(id){
    let roomNumber = [];
    for(let i = 0; i < 4; i++){
      let number = Math.floor(Math.random() * 9) + 1;
      roomNumber.push(number);
    }
    roomNumber = roomNumber.join('');
    if(this.rooms.includes(roomNumber)){
      this.createRoomNumber();
    }
    else{
      let obj = {
        host: id,
        roomNumber: roomNumber,
        players: [],
      };
      this.rooms.push(obj);
      return roomNumber;
    }
  },
  party: function(io){
    let self = this;
    io.on('connection', function(socket){
      socket.on('playerConnected', function(player){

        //change this to false later
        let contiunue = false;
        let enoughPlayers = false;
        for(let i = 0; i < self.games.length; i++){
          if(self.games[i].roomNr === player.room){
            contiunue = true;
            let obj = {
              playerNr: player.nr,
              user: socket.id,
              position: 50,
            };
            if(!self.games[i].players){
              self.games[i].players = [];
              self.games[i].players.push(obj);
            }
            else{
              let pushYesOrNo = true;
              for(let k = 0; k < self.games[i].players.length; k++){
                if(self.games[i].players[k].playerNr === player.nr){
                  pushYesOrNo = false;
                }
              }
              if(pushYesOrNo){
                self.games[i].players.push(obj);
              }
              else{
                console.log('player bestaat al');
              }
            }
            if(self.games[i].players.length  === 2){
              enoughPlayers = true;
            }
          }
        }
        if(contiunue){
          if(enoughPlayers){
            for(let i = 0; i < self.games.length; i++){
              if(self.games[i].roomNr === player.room){
                io.to(self.games[i].host).emit('allPlayersAreConnected');
                for(let k = 0; k < self.games[i].players.length; k++){
                  io.to(self.games[i].players[k].user).emit('allPlayersAreConnected');
                }
              }
            }
          }
          else{
            console.log('nog niet genoeg spelers');
          }
          //doe hier dingen zometeen
        }
        else {
          console.log('deze lobby bestaat neit meer');
          io.emit('lobbyDoesntExist');
        }
      });
      socket.on('hostConnected', function(player){
        //change this to false later
        let contiunue = false;
        if(self.gameRooms.includes(player.room)){
          contiunue = true;
        }
        if(contiunue){
          //doe hier dingen zometeen
          let obj = {
            host: player.player,
            roomNr: player.room
          };
          self.games.push(obj);
          var indexOf = self.gameRooms.indexOf(player.room);
          if (indexOf > -1) {
            self.gameRooms.splice(indexOf, 1);
          }
        }
        else {
          io.emit('lobbyDoesntExist');
        }
      });
      socket.on('disconnect', function(){
        for(let i = 0; i < self.games.length; i++){
          if(self.games[i].host === socket.id){
            //host verlaten
            self.games.splice(i, 1);
          }
          else{
            if(self.games[i].players){
              for(let k = 0; k < self.games[i].players.length; k++){
                if(self.games[i].players[k].user === socket.id){
                  self.games[i].players.splice(k, 1);
                }
              }
            }
          }
        }
      });
      socket.on('cords', function(cord){
        let index = -1;
        let user;
        for(let i = 0; i < self.games.length; i++){
          for(let k = 0; k < self.games[i].players.length; k++){
            if(self.games[i].players[k].user === socket.id){
              user = socket.id;
              index = i;
              break;
            }
          }
          if(self.games[index]){
            let party = self.games[index];
            for(let k = 0; k < party.players.length; k++){
              if(party.players[k].user === socket.id){
                party.players[k].position = cord;
              }
            }
            io.to(party.host).emit('cords', party.players);
          }
        }
      });
    });
  }
};

module.exports = sockets;
