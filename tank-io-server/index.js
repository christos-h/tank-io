var server = require('http').createServer();
var io = require('socket.io')(server);

const games = [];
games.push(new Game(0));

io.on('connection', function (clientSocket) {
    let game = getAvailableGame();

    game.addPlayer(new Player(clientSocket));
    game.startIfReady();

    clientSocket.on('keys', function (data) {
        game.update(data);
    });

    clientSocket.on('disconnect', function () {
        game.disconnect(clientSocket);
    });

    console.log('connected');
});


function getAvailableGame() {
    games.forEach(function (game) {
        if (game.available()) return game;
    });
    return new Game(games.length);
}

server.listen(3000);

function Player(socket) {
    this.socket = socket;
    this.greeting = function () {
        alert('Hi! I\'m ' + this.name + '.');
    };
}

function Game(id) {
    this.maxPayers = 2;
    this.players = [];

    this.addPlayer = function (player) {
        players.push(player);
    };

    this.available = function () {
        return players.length < maxPayers;
    };

    this.startIfReady = function () {
        if (players.length == maxPayers) start();
    };

    this.start = function () {
        console.log('Game ' + id + ' started');
    };

    this.disconnect = function (socket) {
        players.splice(players.indexOf(
            players.find(function (player) {
                return player.socket === socket;
            })), 1);
    };
}

