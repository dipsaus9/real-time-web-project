const sockets = {
  init: function(io){
    let users = [];
    let positions = [
      {
        player: 1,
        position: 50,
        score: 0,
      },
      {
        player: 2,
        position: 50,
        score: 0,
      }
    ];
    io.on('connection', function(socket){
      if(users.length < 3){
        users.push(socket.id);
        io.to(socket.id).emit('start', socket.id);
        io.emit('users', users);
      }
      else{
        io.emit('tooMany', 'message');
      }
      socket.on('cords', function(cord){
        let id = socket.id;
        let indexOf = users.indexOf(socket.id);
        if(indexOf == 1){
          positions[0].position = cord;
        }
        else if(indexOf == 2){
          positions[1].position = cord;
        }
        io.emit('cords', positions);
      });
      socket.on('disconnect', function(){
        let indexOf = users.indexOf(socket.id);
        if(indexOf > -1){
          users.splice(indexOf, 1);
        }
      });
    });
  }
};

module.exports = sockets;
