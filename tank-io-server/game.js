var Bullet = require('./bullet').Bullet;

function Game(id, io) {
    this.id = id;
    this.io = io;
    this.maxPlayers = 4;
    this.players = [];
    this.bullets = [];
    this.started = false;

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
        this.started = true;
        this.players.forEach(player => player.start())
    };

    this.disconnect = function (socket) {
        this.players.splice(this.players.indexOf(
            this.players.find(function (player) {
                console.log('Player ' + player.id + ' disconnected.')
                return player.socket === socket;
            })), 1);

    };

    this.createBullet = function (playerPosition, clickPosition) {
        this.bullets.push(new Bullet(playerPosition, clickPosition));
    }

    this.update = function () {
        this.players.forEach(function (player) {
            player.update();
        })
        
        this.bullets = this.bullets.filter(bullet => bullet.isAlive());
        this.bullets.forEach(function (bullet) {
            bullet.update();
        })
    }

    this.gameState = function gameState() {
        var state = {
            players: [],
            bullets: []
        };
        this.players.forEach(player => state.players.push(player.state()));
        this.bullets.forEach(bullet => state.bullets.push(bullet.state()));
        return state;
    }

    this.emit = function () {
        let gameState = this.gameState();
        this.players.forEach(player => player.emitState(gameState));
    }
}

module.exports = {
    Game: Game
}