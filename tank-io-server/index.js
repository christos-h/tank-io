var server = require('http').createServer();
var io = require('socket.io')(server);

const games = [];
games.push(new Game(0));

io.on('connection', function (clientSocket) {
    let game = getAvailableGame();
    let player = new Player(clientSocket);
    game.addPlayer(player);
    game.startIfReady();

    clientSocket.on('keys', function (data) {
        player.updateKeys(data);
    });

    clientSocket.on('disconnect', function () {
        game.disconnect(clientSocket); // pass player?
    });

    player.greeting();
});


function getAvailableGame() {
    let availableGame = null;
    games.forEach(function (game) {
        if (game.available()) availableGame = game;
    });
    return availableGame === null ? new Game(games.length) : availableGame;
}

server.listen(3000);

function Player(socket) {
    this.socket = socket;
    this.x = 100    ;
    this.y = 100;
    this.theta = 0;
    this.keys = [];
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

    this.greeting = function () {
        console.log('New player');
    };
}

function Game(id) {
    this.maxPlayers = 2;
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
        console.log('Game started');
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
        this.players.forEach(player => state.push({ x: player.x, y: player.y, theta: player.theta }))
        return state;
    }

    this.emit = function () {
        io.emit('state', this.gameState());
    }
}

// Game Loop ======================================================================================

var tickLengthMs = 1000 / 30

/* gameLoop related variables */
// timestamp of each loop
var previousTick = Date.now()
// number of times gameLoop gets called
var actualTicks = 0

var gameLoop = function () {
    var now = Date.now()

    actualTicks++
    if (previousTick + tickLengthMs <= now) {
        var delta = (now - previousTick) / 1000
        previousTick = now
        update(delta)
        actualTicks = 0
    }

    if (Date.now() - previousTick < tickLengthMs - 16) {
        setTimeout(gameLoop)
    } else {
        setImmediate(gameLoop)
    }
}

function update(delta) {
    // games.filter(available).foreach...
    games.forEach(function (game) {
        game.update();
        game.emit();
    });
}

gameLoop();

console.log('Server started')