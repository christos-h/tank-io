function Player(id, socket) {
    this.id = id;
    this.socket = socket;
    this.x = 250 + Math.round((Math.random() - 0.5) * 500);
    this.y = 250 + Math.round((Math.random() - 0.5) * 500);
    this.theta = 0;
    this.cannonTheta = 0;
    this.key = 0;
    this.color = getRandomColor();
    // L R U D 0 (no key)
    this.updateKeys = function (key) {
        this.key = key
    }

    this.update = function () {
        let dx = 0;
        let dy = 0;
        switch (this.key) {
            case 37: // L
                dx = -6;
                break;
            case 39: // R
                dx = 6;
                break;
            case 38: // U
                dy = -6;
                break;
            case 40: // D
                dy = 6;
                break;
            case '0':
                break;
        }
        this.x += dx;
        this.y += dy;
        if (this.x < 0) this.x = 0;
        if (this.x > 1000) this.x = 1000;
        if (this.y < 0) this.y = 0;
        if (this.y > 800) this.y = 800;
    }

    this.position = function () {
        return {
            x: this.x,
            y: this.y
        }
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
        return { id: this.id, x: this.x, y: this.y, theta: this.theta, color: this.color, cannonTheta: this.cannonTheta };
    }

    this.updateCannonTheta = function (mouse) {
        this.cannonTheta = Math.atan2(mouse.y - this.y, mouse.x - this.x);
    }
}

module.exports = {
    Player: Player
}