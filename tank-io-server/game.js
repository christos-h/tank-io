function Game(id, io) {
    this.id = id;
    this.io = io;
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
                console.log('Player ' + player.id + ' disconnected.')
                return player.socket === socket;
            })), 1);
        
    };

    this.update = function () {
        this.players.forEach(function (player) {
            player.update();
        })
    }

    this.gameState = function gameState() {
        var state = [];
        this.players.forEach(player => state.push(player.state()));
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