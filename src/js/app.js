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
let previousPostion = 180;
const socket = io();

const socketHandler = {
  init: function(){
    this.join();
    this.create();
    this.players();
    this.host();
  },

  join: function(){
    let you = '';
    let yourPlayer = 0;
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
      socket.on('roomFull', function(){
        alert('room is full');
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
              yourPlayer = players[i].player;
              li.setAttribute('class', 'you');
            }
            li.appendChild(liText);
            list.appendChild(li);
          }
        }
      });
      socket.on('hostDisconnected', function(room){
        let players = room.players;
        for(let i = 0; i < players.length; i++){
          if(players[i].user === you){
            let element = document.querySelector('.host-diconnect');
            element.classList.add('active');
          }
        }
      });
      socket.on('startGame', function(room){
        //add timeout so the server can load first
        setTimeout(function(){
          if(yourPlayer === 1){
            let url = '/game/player1/' + room.roomNumber;
            window.location.href = url;
          }
          else if (yourPlayer === 2) {
            let url = '/game/player2/' + room.roomNumber;
            window.location.href = url;
          }
        }, 1000);
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

      startGame.addEventListener('click', function(){
        if(lobbyPlayers.length === 2){
          socket.emit('startGame', you);
        }
        else{
          console.log('er zijn nog niet genoeg mensen in de lobby');
        }
      });
      socket.on('startGameHost', function(room){
        let url = '/game/host/' + room.roomNumber;
        window.location.href = url;
      });
    }
  },
  players: function(){
    let you = '';
    let player = '';
    let play = false;
    let self = this;
    if(main.classList.contains('player')){
      socket.on('connected', function(id){
        you = id;
        let url = window.location.href;
        let room = '';
        if(main.classList.contains('player1')){
          player = 1;

          room = url.split('/player1/');
          room = room[1];
        }
        else if (main.classList.contains('player2')) {
          player = 2;
          room = url.split('/player2/');
          room = room[1];
        }
        let obj = {
          player: you,
          nr: player,
          room: room
        };
        socket.emit('playerConnected', obj);

        socket.on('allPlayersAreConnected', function(){
          main.classList.add('active');
          play = true;
        });
        let buttons = document.querySelectorAll('.settings div');
        buttons.forEach(function(button){
          button.addEventListener('click', function(e){
            e.preventDefault();
            buttons.forEach(function(b){
              b.classList.remove('active');
            });
            e.target.classList.add('active');
          });
        });
        window.addEventListener('deviceorientation', self.handleOrientation, true);
        let left = document.querySelector('.left');
        let right = document.querySelector('.right');
        let startLeft = false;
        let startRight = false;
        let position = 50;
        let timeoutId = undefined;

        left.addEventListener('mousedown', function(){
          startLeft = true;
          holdLeftMouseDown();
        });
        left.addEventListener('mouseup', function(){
          startLeft = false;
          window.clearTimeout(timeoutId);
          holdLeftMouseDown();
        });
        left.addEventListener('touchstart', function(){
          startLeft = true;
          holdLeftMouseDown();
        });
        left.addEventListener('touchend', function(){
          startLeft = false;
          window.clearTimeout(timeoutId);
          holdLeftMouseDown();
        });



        right.addEventListener('mousedown', function(){
          startRight = true;
          holdRightMouseDown();
        });
        right.addEventListener('mouseup', function(){
          startRight = false;
          window.clearTimeout(timeoutId);
          holdRightMouseDown();
        });
        right.addEventListener('touchstart', function(){
          startRight = true;
          holdRightMouseDown();
        });
        right.addEventListener('touchend', function(){
          startRight = false;
          window.clearTimeout(timeoutId);
          holdRightMouseDown();
        });

        let tab = document.querySelector('.buttons');
        function holdRightMouseDown(){
          if(tab.classList.contains('active')){
            if(startRight){
              if(position < 100){
                position += 1;
                socket.emit('cords', position);
              }
              timeoutId = window.setTimeout(function(){
                holdRightMouseDown();
              }, 30);
            }
          }
        }

        function holdLeftMouseDown(){
          if(tab.classList.contains('active')){
            if(startLeft){
              if(position > 0){
                position -= 1;
                socket.emit('cords', position);
              }
              timeoutId = window.setTimeout(function(){
                holdLeftMouseDown();
              }, 30);
            }
          }
        }

      });
    }
  },
  host: function(){
    let you = '';
    if(main.classList.contains('host')){
      socket.on('connected', function(id){
        you = id;
        let url = window.location.href;
        let room = '';
        room = url.split('/host/');
        room = room[1];
        let obj = {
          player: you,
          room: room
        };
        socket.emit('hostConnected', obj);

        socket.on('allPlayersAreConnected', function(){
          main.classList.add('active');
          playGame();
        });
        socket.on('cords', function(cords){
          let player1;
          let player2;
          for(let i = 0; i < cords.length; i++){
            if(cords[i].playerNr === 1){
              player1 = cords[i];
            }
            else if(cords[i].playerNr === 2){
              player2 = cords[i];
            }
          }
          let pad1 = document.querySelector('.player1Pad');
          let pad2 = document.querySelector('.player2Pad');
          if(player1){
            let pad1Position = player1.position + '%';
            pad1.style.left = pad1Position;
          }
          if(player2){
            let pad2Position = player2.position + '%';
            pad2.style.left = pad2Position;
          }
        });
        let ball = document.querySelector('.ball');
        let direction = 'bottom';;
        let leftRight = 'left';
        let timeoutId;
        let angle;
        function playGame(){
          timeoutId = undefined;
          angle = Math.floor(Math.random() * 5) + 4;
          letsPlay();
        }
        function letsPlay(){
          let player1Cord = document.querySelector('.player1Pad').getBoundingClientRect().x;
          let player2Cord = document.querySelector('.player2Pad').getBoundingClientRect().x;
          let ballPositionTop = ball.getBoundingClientRect().y;
          let ballPositionLeft = ball.getBoundingClientRect().x;
          let windowHeight = window.innerHeight;
          let windowWidth = window.innerWidth;
          let padWidth = windowWidth / 5;
          let bounce = true;
          if(ballPositionLeft > 0 && leftRight == 'left'){
            ballPositionLeft -= angle;
            if(ballPositionLeft < 0){
              ballPositionLeft = 0;
            }
            ball.style.left = (ballPositionLeft + 'px');
          }
          else if(ballPositionLeft <= 0 && leftRight == 'left'){
            leftRight = 'right';
          }
          else if(ballPositionLeft < (windowWidth - 25) && leftRight == 'right'){
            ballPositionLeft += angle;
            if(ballPositionLeft > (windowWidth - 25)){
              ballPositionLeft = (windowWidth - 25);
            }
            ball.style.left = (ballPositionLeft + 'px');
          }
          else if(ballPositionLeft >= (windowWidth - 25) && leftRight == 'right'){
            leftRight = 'left';
          }

          if(ballPositionTop > 25 && direction == 'top'){
            ballPositionTop -= 5;
            ball.style.top = (ballPositionTop + 'px');
          }
          else if(ballPositionTop <= 25 && direction == 'top'){
            let hit = false;
            if(player1Cord < ballPositionLeft && (player1Cord + padWidth) >= ballPositionLeft){
              hit = true;
            }
            else if(player1Cord > ballPositionLeft && (player1Cord + padWidth) <= ballPositionLeft){
              hit = true;
            }
            if(hit){
              direction = 'bottom';
            }
            else{
              window.clearTimeout(timeoutId);
              bounce = false;
              pointScored(2);
            }
          }
          else if(ballPositionTop < (windowHeight - 50) && direction == 'bottom'){
            ballPositionTop += 5;
            ball.style.top = (ballPositionTop + 'px');
          }
          else if(ballPositionTop >= (windowHeight - 50 && direction == 'bottom')){
            let hit = false;
            if(player2Cord < ballPositionLeft && (player2Cord + padWidth) >= ballPositionLeft){
              hit = true;
            }
            else if(player2Cord > ballPositionLeft && (player2Cord + padWidth) <= ballPositionLeft){
              hit = true;
            }
            if(hit){
              direction = 'top';

            }
            else{
              window.clearTimeout(timeoutId);
              bounce = false;
              pointScored(1);
            }
          }
          if(bounce){
            timeoutId = window.setTimeout(function(){
              letsPlay();
            }, 50);
          }
        }
        let player1Point = 0;
        let player2Point = 0;
        function pointScored(id){
          let firstScore = document.querySelector('.player1Score');
          let secondScore = document.querySelector('.player2Score');
          if(id === 1){
            player1Point += 1;
            direction = 'top';
            firstScore.innerHTML = player1Point;
          }
          else if(id === 2){
            player2Point += 1;
            direction = 'bottom';
            secondScore.innerHTML = player2Point;
          }
          ball.style.top = '50%';
          ball.style.left = '50%';
          setTimeout(function(){
            playGame();
          }, 300);
        }
      });
    }
  },
  handleOrientation: function(e){
    let tab = document.querySelector('.turn');
    if(tab.classList.contains('active')){
      var beta = e.beta;
      var difference = previousPostion - beta;
      //maybe change the fire limit for later?
      if(difference > 0 || difference < 0){
        previousPostion = beta;
        //cords previousPostion be from -180 to 180 create scale from this
        //create scale from 0 to 360
        let calcCord = beta + 180;
        //create scale from 0 to 100, then get the scale from 35 to 65, this will be the position of the element in %
        let position = ((calcCord * 100 / 360) - 35) / 0.3;
        if(position < 0){
          position = 0;
        }
        else if(position > 100){
          position = 100;
        }
        socket.emit('cords', position);
      }
    }
  }
};

socketHandler.init();
