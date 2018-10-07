var server = require('http').createServer();
var io = require('socket.io')(server);
var sha = require('sha1')

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
    availableGame = new Game(games.length);
    games.push(availableGame);
    return availableGame;
}

server.listen(3000);

function Player(id, socket) {
    this.id = id;
    this.socket = socket;
    this.x = 250 + Math.round((Math.random() - 0.5) * 500);
    this.y = 250 + Math.round((Math.random() - 0.5) * 500);
    this.theta = 0;
    this.keys = [];
    this.color = getRandomColor();
    // L R U D
    this.updateKeys = function (data) {
        this.keys = data.split('');
    }

    this.update = function () {
        //Get theta from keys
        this.theta += 4 * Math.PI / 360;
        // Update positions
        this.x += 2 * Math.cos(this.theta);
        this.y += 2 * Math.sin(this.theta);
    }

    this.state = function () {
        return { id: this.id, x: this.x, y: this.y, theta: this.theta, color: this.color };
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    this.start = function start(){
        this.socket.emit('start');
    }
}

function Game(id) {
    this.id = id;
    this.maxPlayers = 4;
    this.players = [];

    this.addPlayer = function (player) {
        this.players.push(player);
    };

    this.available = function () {
        return this.players.length < this.maxPlayers;
    };

    this.startIfReady = function () {
        if (this.players.length == this.maxPlayers) this.start();
    };

    this.start = function () {
        this.players.forEach(player => player.start())
    };

    this.disconnect = function (socket) {
        this.players.splice(this.players.indexOf(
            this.players.find(function (player) {
                return player.socket === socket;
            })), 1);
        console.log('Player Disconnected');
    };

    this.update = function () {
        this.players.forEach(function (player) {
            player.update();
        })
    }

    this.gameState = function () {
        var state = []
        this.players.forEach(player => state.push(player.state()))
        return state;
    }

    this.emit = function () {
        io.emit('state', this.gameState());
    }
}

// Game Loop ======================================================================================

var gameLoop = function () {
    update();
    setTimeout(gameLoop, 33)
}

function update() {
    // games.filter(available).foreach...
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