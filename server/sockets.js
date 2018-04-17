const sockets = {
  init: function(io){
    io.on('connection', function(socket){
      socket.on('cords', function(cord){
        io.emit('cords', cord);
      });
      socket.on('disconnect', function(){
      });
    });
  }
};

module.exports = sockets;
