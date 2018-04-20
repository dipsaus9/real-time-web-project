// const socket = io();
//
//
// window.addEventListener('deviceorientation', handleOrientation, true);
// let user;
// let number = -1;
// socket.on('start', function(id){
//   user = id;
// });
// socket.on('users', function(users){
//   let indexOf = users.indexOf(user);
// });
// let positionTouch = 50;
// window.addEventListener('keydown', function(e){
//   if(number !== 0){
//     if(e.key == 'ArrowDown'){
//       if(positionTouch < 100){
//         positionTouch += 3;
//         socket.emit('cords', positionTouch);
//       }
//     }
//     else if(e.key == 'ArrowUp'){
//       if(positionTouch > 0){
//         positionTouch -= 3;
//         socket.emit('cords', positionTouch);
//       }
//     }
//   }
// });
// let previouwPosition = 180;
// function handleOrientation(event) {
//   var beta = event.beta;
//   var difference = previouwPosition - beta;
//   //maybe change the fire limit for later?
//   if(difference > 0 || difference < 0){
//     previouwPosition = beta;
//     //cords can be from -180 to 180 create scale from this
//     //create scale from 0 to 360
//     let calcCord = beta + 180;
//     //create scale from 0 to 100, then get the scale from 35 to 65, this will be the position of the element in %
//     let position = ((calcCord * 100 / 360) - 35) / 0.3;
//     if(position < 0){
//       position = 0;
//     }
//     else if(position > 100){
//       position = 100;
//     }
//     if(number !== 0){
//     //emit a position from 0% to 100%
//       socket.emit('cords', position);
//     }
//   }
// }
// var element1 = document.querySelector('#player1');
// var element2 = document.querySelector('#player2');
// socket.on('cords', function(cord){
//   let firstPosition = cord[0].position + '%';
//   element1.style.top = firstPosition;
//   let secondPosition = cord[1].position + '%';
//   element2.style.top = secondPosition;
// });
let main = document.querySelector('main');
const socket = io();

const socketHandler = {
  init: function(){
    this.home();
    this.join();
    this.create();
  },
  home: function(){
    if(main.classList.contains('home')){

    }
  },
  join: function(){
    let you = '';
    if(main.classList.contains('join')){
      socket.on('connected', function(id){
        you = id;
        socket.emit('viewRooms', '');
      });
      socket.on('viewRooms', function(rooms){
        if(document.querySelector('.list')){
          let element = document.querySelector('.list');
          element.innerHTML = '';
          for(let i = 0; i < rooms.length; i++){
            let li = document.createElement('li');
            let liText = document.createTextNode(rooms[i].roomNumber);
            li.appendChild(liText);
            li.addEventListener('click', function(){
              socket.emit('joinRoom', rooms[i].roomNumber);
            });
            element.appendChild(li);
          }
        }
      });

      socket.on('joinedRoom', function(room){
        let joined = false;
        let players = room.players;
        for(let i = 0; i < players.length; i++){
          if(players[i].user === you){
            joined = true;
            let container = document.querySelector('.container');
            container.innerHTML = '';
          }
        }
        if(joined){
          let list = document.querySelector('.join .users');
          list.innerHTML = '';
          for(let i = 0; i < players.length; i++){
            let li = document.createElement('li');
            let liText = document.createTextNode('player: ' + players[i].player);
            if(players[i].user === you){
              li.setAttribute('class', 'you');
            }
            li.appendChild(liText);
            list.appendChild(li);
          }
        }
      });
      socket.on('hostDisconnected', function(room){
        console.log(room);
        let players = room.players;
        for(let i = 0; i < players.length; i++){
          if(players[i].user === you){
            let element = document.querySelector('.host-diconnect');
            element.classList.add('active');
          }
        }
      });
      socket.on('startGame', function(room){
        console.log(room);
      });
    }
  },
  create: function(){
    let you = '';
    if(main.classList.contains('create')){
      let lobbyPlayers = [];
      let startGame = document.querySelector('.start');
      startGame.disabled = true;
      socket.on('connected', function(id){
        you = id;
        socket.emit('newRoom', '');
      });
      socket.on('yourRoom', function(number){
        let element = document.querySelector('.number');
        element.innerHTML = number;
      });
      socket.on('joinedRoom', function(room){
        if(room.host === you){
          let players = room.players;
          lobbyPlayers = players;
          if(players.length === 2){
            startGame.disabled = false;
          }
          else{
            startGame.disabled = true;
          }
          let list = document.querySelector('.create .list');
          list.innerHTML = '';
          for(let i = 0; i < players.length; i++){
            let li = document.createElement('li');
            let liText = document.createTextNode('player: ' + players[i].player);
            li.appendChild(liText);
            list.appendChild(li);
          }
        }
      });
      startGame.addEventListener('click', function(e){
        if(lobbyPlayers.length === 2){
          socket.emit('startGame', you);
        }
        else{
          console.log('er zijn nog niet genoeg mensen in de lobby');
        }
      });
    }
  }
};

socketHandler.init();
