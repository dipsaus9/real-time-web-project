const sockets = {
  init: function(io){
    this.create(io);
    this.party(io);
  },
  rooms: [],
  gameRooms: [],
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
            let data = self.rooms[i];
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
        let contiunue = false;
        console.log(player, self.games);
        if(self.gameRooms.includes(player.room)){
          contiunue = true;
        }
        if(contiunue){
          console.log('test');
        }
        else {
          io.emit('lobbyDoesntExist');
        }
      });
    });
  }
};

module.exports = sockets;
