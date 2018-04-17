const socket = io();


window.addEventListener('deviceorientation', handleOrientation, true);
let user;
let number = -1;
socket.on('start', function(id){
  user = id;
});
socket.on('users', function(users){
  let indexOf = users.indexOf(user);
});
let positionTouch = 50;
window.addEventListener('keydown', function(e){
  if(number !== 0){
    if(e.key == 'ArrowDown'){
      if(positionTouch < 100){
        positionTouch += 3;
        socket.emit('cords', positionTouch);
      }
    }
    else if(e.key == 'ArrowUp'){
      if(positionTouch > 0){
        positionTouch -= 3;
        socket.emit('cords', positionTouch);
      }
    }
  }
});
let previouwPosition = 180;
function handleOrientation(event) {
  var beta = event.beta;
  var difference = previouwPosition - beta;
  //maybe change the fire limit for later?
  if(difference > 0 || difference < 0){
    previouwPosition = beta;
    //cords can be from -180 to 180 create scale from this
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
    if(number !== 0){
    //emit a position from 0% to 100%
      socket.emit('cords', position);
    }
  }
}
var element1 = document.querySelector('#player1');
var element2 = document.querySelector('#player2');
socket.on('cords', function(cord){
  let firstPosition = cord[0].position + '%';
  element1.style.top = firstPosition;
  let secondPosition = cord[1].position + '%';
  element2.style.top = secondPosition;
});
