const sockets = {
  init: function(io){
    io.on('connection', function(socket){
      console.log('a user connected');
      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    });
  }
};

module.exports = sockets;