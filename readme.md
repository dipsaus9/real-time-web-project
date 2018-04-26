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
All pages are being structured with `express`. All pages are being loaded from the `/server/routes` folder. In these files you can create a new route with new data properties. To add them to server you could require them in the `/server/app.js`. All files are using a `GET` method only at this moment.

### Socket.IO
For this project I'm using `Socket.IO`. Socket uses a client and a server version. Here I'll describe the server version only.
The socket functions are being serverd from the `/server/socket.js` file. This file contains the complete data manipulation of all users and every game. All games are being watched by sockets with a own creation of rooms.

Each room has a host property and two players. If there are already two users you won't be able to join that room. Before entering the game, socket keeps all available room before the user will have any controll. This way the user won't be able to hack the system.

All files in the socket.io file are being seperated into two big functions. `create` and `party`. The `create` function is for the lobby system on the start screen. The `party` function is for all files in a game.

### Client JavaScript
All client side JavaScript functions are being seperated by checkign on wich page the user is. By a simple class check before firing all functions.


On the client side JavaScript the files will only keep track of your own socket.ID and the page that is active. All other properties are being handled by the server.

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
![Data model](data.jpg)


# License
MIT © Dipsaus9
