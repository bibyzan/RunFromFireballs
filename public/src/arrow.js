
const arrowIcon = (direction) => (
    direction === directions.right ? 'arrowright' :
        direction === directions.left ? 'arrowleft' :
            direction === directions.up ? 'arrowup' :
                direction === directions.down ? 'arrowdown' : null
);

class Arrow extends Phaser.GameObjects.Sprite {
    constructor(game) {
        super(game, game.player.x, game.player.y, arrowIcon(game.player.direction));
        const {direction} = game.player;
        game.add.existing(this);
        game.projectiles.add(this);
        game.physics.world.enableBody(this);
        this.setScale(2);
        this.setInteractive();
        // console.log('height', game.config.height);
        if (direction === directions.right) {
            this.x += 20;
            this.body.velocity.x = 500;
        } else if (direction === directions.left) {
            this.x -= 20;
            this.body.velocity.x = -500;
        } else if (direction === directions.up) {
            this.y -= 20;
            this.body.velocity.y = -500;
        } else if (direction === directions.down) {
            this.y += 20;
            this.body.velocity.y = 500;
            console.log('down');
        }
    }

    update() {
        if (this.y > totalWidth || this.x > totalWidth || this.y < 0 || this.x < 0) {
            this.destroy();
            console.log('arrow destroyed');
        }
    }
}
