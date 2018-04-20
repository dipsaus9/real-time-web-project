const sockets = {
  init: function(io){
    this.create(io);
    this.join(io);
  },
  roomNumbers: [],
  create: function(io){
    //all create a lobby sockets
    let self = this;
    io.on('connection', function(socket){
      io.to(socket.id).emit('connected', socket.id);
      socket.on('newRoom', function(){
        let number = self.createRoomNumber(socket.id);
        io.emit('yourRoom', number);
        io.emit('viewRooms', self.roomNumbers);
      });
      socket.on('viewRooms', function(){
        io.emit('viewRooms', self.roomNumbers);
      });

      socket.on('joinRoom', function(room){
        for(let i = 0; i < self.roomNumbers.length; i++){
          if(self.roomNumbers[i].roomNumber === room){
            let player = 0;
            if(self.roomNumbers[i].players.length < 1){
              player = 1;
            }
            else if(self.roomNumbers[i].players.length < 2){
              if(self.roomNumbers[i].players[0].user !== socket.id){
                player = 2;
              }
            }
            else{
              io.emit('roomFull');
            }
            if(player > 0){
              if(self.roomNumbers[i].roomNumber == room){
                let obj = {
                  user: socket.id,
                  player: player
                };
                self.roomNumbers[i].players.push(obj);
              }
              io.emit('joinedRoom', self.roomNumbers[i]);
            }
          }
        }
      });
      socket.on('disconnect', function(){
        for(let i = 0; i < self.roomNumbers.length; i++){
          if(self.roomNumbers[i].host == socket.id){
            io.emit('hostDisconnected', self.roomNumbers[i]);
            self.roomNumbers.splice(i, 1);
          }
          else{
            for(let k = 0; k < self.roomNumbers[i].players.length; k++){
              if(self.roomNumbers[i].players[k].user === socket.id){
                self.roomNumbers[i].players.splice(k, 1);
                io.emit('joinedRoom', self.roomNumbers[i]);
              }
            }
          }
        }
        io.emit('viewRooms', self.roomNumbers);
      });
      socket.on('startGame', function(id){
        for(let i = 0; i < self.roomNumbers.length; i++){
          if(self.roomNumbers[i].host === id){
            io.to(id).emit('startGame', self.roomNumbers[i]);
            for(let k = 0; k < self.roomNumbers[i].players.length; k++){
              io.to(self.roomNumbers[i].players[k].user).emit('startGame', self.roomNumbers[i]);
            }
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
    if(this.roomNumbers.includes(roomNumber)){
      this.createRoomNumber();
    }
    else{
      let obj = {
        host: id,
        roomNumber: roomNumber,
        players: [],
      };
      this.roomNumbers.push(obj);
      return roomNumber;
    }
  },
  join: function(io){
    io.on('connection', function(socket){
      socket.on('disconnect', function(){

      });
    });
  }
};

module.exports = sockets;
