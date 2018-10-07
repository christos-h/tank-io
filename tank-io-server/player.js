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

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    this.start = function () {
        this.socket.emit('start');
    }

    this.emitState = function (gameState) {
        this.socket.emit('state', gameState);
    }

    this.state = function () {
        return { id: this.id, x: this.x, y: this.y, theta: this.theta, color: this.color };
    }
}

module.exports = {
    Player: Player
}