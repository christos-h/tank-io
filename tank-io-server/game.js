var Bullet = require('./bullet').Bullet;
var server = require('./server');

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
        let dtheta = (2 * Math.PI) / this.players.length;
        let theta = 0;
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].setInitialPos(theta);
            theta += dtheta;
        }
        this.players.forEach(player => player.start())
    };

    this.disconnect = function (player) {
        this.players = this.players.filter(pl => pl != player);
    };

    this.createBullet = function (playerPosition, clickPosition) {
        this.bullets.push(new Bullet(playerPosition, clickPosition));
    }

    this.update = function () {
        this.players.forEach(function (player) {
            player.update();
        });

        this.bullets = this.bullets.filter(bullet => bullet.isAlive());

        this.bullets.forEach(function (bullet) {
            bullet.update();
        });

        for (var p = 0; p < this.players.length; p++) {
            for (var b = 0; b < this.bullets.length; b++) {
                let player = this.players[p];
                let bullet = this.bullets[b];
                if (player.collides(bullet.x, bullet.y)) {
                    player.gameOverWin();
                    this.players.splice(p, 1);
                    this.bullets.splice(b, 1);
                    server.addToQueue(player.socket);
                    continue;
                }
            }
        }

        if (this.players.length == 1) {
            this.players[0].gameOverLose();
            server.addToQueue(this.players[0].socket);
            this.players.splice(0, 1);
        }
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