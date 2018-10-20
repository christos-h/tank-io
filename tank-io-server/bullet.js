function Bullet(playerPosition, clickPosition) {
    this.velocity = 5;
    this.theta = Math.atan2(clickPosition.y - playerPosition.y, clickPosition.x - playerPosition.x);
    this.x = playerPosition.x;
    this.y = playerPosition.y;

    this.update = function () {
        this.x += this.velocity * Math.cos(this.theta);
        this.y += this.velocity * Math.sin(this.theta);
    }

    this.state = function () {
        return {
            x: this.x,
            y: this.y
        }
    }
}

module.exports = {
    Bullet: Bullet
}