var server = require('http').createServer();
var io = require('socket.io')(server);
var sha = require('sha1');
var Player = require('./player').Player;
var Game = require('./game').Game;

const games = [];

io.on('connection', function (clientSocket) {
    let game = getAvailableGame();
    let id = generateId();
    let player = new Player(id, clientSocket);
    game.addPlayer(player);
    game.startIfReady();
    clientSocket.emit('id', id);
    clientSocket.emit('global', globalState());
    clientSocket.on('keys', function (data) {
        player.updateKeys(data);
    });

    clientSocket.on('disconnect', function () {
        game.disconnect(clientSocket); // pass player?
    });
    console.log(player.id + ' connected');
});

function generateId() { return sha(Math.round(Math.random() * 10000000)) }

function getAvailableGame() {
    let availableGame = null;
    games.forEach(function (game) {
        if (game.available()) availableGame = game;
    });
    if (availableGame != null) return availableGame;
    availableGame = new Game(games.length, io);
    games.push(availableGame);
    return availableGame;
}

server.listen(3000);

// Game Loop ======================================================================================

var gameLoop = function () {
    update();
    setTimeout(gameLoop, 33)
}

function update() {
    games.filter(game => !game.available()).forEach(function (game) {
        game.update();
        game.emit();
    });
}

function globalStateLoop() {
    io.emit('global', globalState());
    setTimeout(globalStateLoop, 1000);
}

function globalState() {
    return {
        nPlayers: games.map(g => g.players.length).reduce((a, b) => a + b, 0)
    }
}

gameLoop();
globalStateLoop();

console.log('Server started')