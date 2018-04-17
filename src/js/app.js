const socket = io();


window.addEventListener('deviceorientation', handleOrientation, true);
let previouwPosition = 1000;
function handleOrientation(event) {
  var beta = event.beta;
  var difference = previouwPosition - beta;
  //maybe change the fire limit for later?
  if(difference > 0 || difference < 0){
    previouwPosition = beta;
    socket.emit('cords', beta);
  }
}
var element = document.querySelector('#ball');
socket.on('cords', function(cord){
  //cords can be from -180 to 180 create scale from this
  //create scale from 0 to 360
  let calcCord = cord + 180;
  //create scale from 0 to 100, then get the scale from 35 to 65, this will be the position of the element in %
  let position = ((calcCord * 100 / 360) - 35) / 0.3;
  console.log(position);
  if(position < 0){
    position = 0;
  }
  else if(position > 100){
    position = 100;
  }
  position = position + '%';
  element.style.top = position;
});
