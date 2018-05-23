# Lets play PONG!
Before I'll start I have to say that this is on of the hardest project I've ever made. Not cause the game is so hard to create, but this project is based on massive error handling. I' talk about this problem later in this document.

As being said this project is based on the game Pong. The goal of the game is to score on the opposing side of the board. This project gives the user the opportunity to join or create a local room to play pong vs each other. The sitation of the game would be when friends are in one room with a big screen at their reach so they can host 1 part and then play with their phones.

## Getting Started
This project is based on `node.js`, an `express` server and `Socket.IO`. This project serves all files created in the src folder and copy / compiles them into the public folder.
`concurrency`, `node-sass`, `del-cli` and `copyFiles` are being used for development.

To run this project copy this project and run:

#### install packages

```
npm install
```

#### Build all files

```
npm run build
```

#### For development

```
npm run dev
```

### Server only
```
npm start
```

`npm run dev` & `npm start` will start a server on `localhost:3000`.

## Documentation
This project is seperated in multiple modules. I'll describe each module in two different ways. This application has different function for the host user and the client user.

### Express
All pages are being structured with `express`. All pages are being loaded from the `/server/routes` folder. In these files you can create a new route with new data properties. To add them to server you could require them in the `/server/app.js`. All files are using a `GET` method only at this moment. There is no `POST` or other server methods being used.

### Socket.IO
For this project I'm using `Socket.IO`. Socket uses a client and a server version. Here I'll describe the server version only.
The socket functions are being serverd from the `/server/socket.js` file. This file contains the complete data manipulation of all users and every game. All games are being watched by sockets with a own creation of rooms.

I created the game based on two structures. I'll call them `the host` and `the player`. The host isn't actually hosting anything serverwise but that player is hosting the game. By that I mean that he host is the only screen that is showing the game real time while the other players won't be able to see the game. The host has a few options to start with.
The host can create a new room. All other players that are online can now join the party of the host. If the host decided to leave the party all other players will get a message: `The host has left the game, return to all lobbys` following with a back button. This will happen at all states of the game. When all players are ready for the game the host can decide to start the game following more actions on client side JavaScript.

All pages are being identified by ID's. The join and create lobby party are being seperated by url. For example the create room has this url: `/lobby/create` and the join room has this url: `/lobby/join`. On the client side I can now determine wich user is a host or a player.

`The player` has other options. In my case the best scenario is when the player uses a phone to controll the game. On the lobby page the player will see a real time connection of all rooms and players that are joining them. If a lobby is full the player won't be able to join this lobby. The player only has controll over wich rooms he will join. If a player disconnect in the lobby room he will simply be removed from the party and the room will have an open spot.
If the game actually already started and a player disconnects something different will happen. All players are being saved on the server and are being watched there. If a player disconnects the game will pause untill the player reconnects or the host decided to end the game. In this way a player can always pause the game if he / she needs to take a badroom break;

#### Structure
The structure in this file is pretty complicated so I'll describe them seperatly.

##### Host
###### Lobby system
`client`: Hey server, I want to create a new room

`server`: Hi client, I see that you are new here, I'll create a unique room ID for you that you can use and I'll add this room to all rooms available. All players can now find you and I'll give you a message when a player joins your room.

`client`: Thanks server, just let me know when a player has joined me.

`server`: Hi client, Player3501 and Player1028 has joined your room. Here is all the information about these players, if you want you can start the game now.

`client`: Hi server, Start the game with these players and send them to the game lobby.

`server`: I've succesfully send these players a message, you can now join the game lobby. I'll redirect you to your lobby.

###### Game
`client`: Hey server, I got this url: `/game/host/6501`. I want to start the game, is this lobby available?

`server`: Hey you made it here. I'll check if your lobby is still valid with the right amount of players

`server`: I've got lobby 6501 registered in the old lobby system, I'll transfer this to your game lobby now, you have to wait till all players are ready now but you can render the game now but put it on pause for now.

`client`: Thanks, I'll do that. Just let me know when all players are ready.

`server`: I've got 2 players that are joined the room, I gave them the name: player1 and player2 and I'm keeping track of their movement now. START THE GAME!!

`client`: LETS PLAY PONG!


##### player
###### Lobby system
`client`: Hey server, I am a new player that wants to game, can I see all lobbys available for me?

`server`: Hi client, I see that you are new here, Here is the list of lobbys you can join if you want

`client`: Thanks server, I want to join lobby 6501

`server`: Hi client, you have succesfully joined lobby 6501. I'll give the host a message that you joined him. When the host starts the party I'll let you know.

`server`: The host has started the game, I'll redirect you to the game lobby.

###### Game
`client`: Hey server, I got this url: `/game/player1/6501`. I want to join this game, is this lobby available?

`server`: Hi player1 you made it. I'll check if your lobby is still valid and if the host is there already.

`server`: I've got lobby 6501 registered in the old lobby system, I'll transfer this to your game lobby now. The host is waiting if all players are ready to join.

`client`: Thanks, I'll do that. Just let me know when all players are ready.

`server`: All players are ready, track your movemnt now so I can send this data to the game!

`client`: LETS PLAY PONG!

I created these conversation to descirbe the system of my game. This is a user scenario if the game will work perfectly on this side of the game.


After the host presses the button to start the game all players and the host will be redirected to another page. This page will be created by the player and the number of the lobby. The server will then create an object where all rooms are being collected. When a host then gets to that specific page the server will first check if this lobby is still available. This way I´ll prevent people of creating a own lobby by creating an URL. If you will find this URL when the server didn't create it first you will get a message that the lobby doesn't exist anymore.

### Client JavaScript
All client side JavaScript functions are being seperated by checkin on wich page the user is. By a simple class check before firing all functions.

On the client side JavaScript the files will only keep track of your own socket.ID and the page that is active. All other properties are being handled by the server. All functions on the client side are being checked on the server aswell. This way I hope to prevent people from hacking their score and position.

# To Do
I made this project in 4 days during a school assignment. Unfortunately this project is bigger then I expected. This resulted in a half finished product. There are some small bugs that I would like to solve.

- [x] Create lobby system
- [x] Create host and Client
- [x] Create message when host left
- [x] Create message when player left
- [x] Working Pong game
- [x] Create specific game lobby where no other players can join
- [x] Multiple controll system of the game
- [x] Gyroscope controll on game
- [x] Pause game when user disconnects during the game
- [x] Disable when too many players wants to join the lobby
- [ ] Server offline message
- [ ] Styling
- [ ] Add more games
- [ ] Add database with more controll on the users
- [ ] Add session ID with sockets
- [ ] Give host a opportunity to kick players

### Structure
All data being saved on the server:
-   Rooms
-   Players
-   Game rooms


# License
MIT © Dipsaus9
