
const arrowRotation = (direction) => (
    direction === directions.right ? 90 :
        direction === directions.left ? -90 :
            direction === directions.up ? 0 :
                direction === directions.down ? 180 : null
);

const ArrowTypes = {
    regular: 'regular',
    red: 'red',
    blue: 'blue',
};

const arrowImg = (type) => (
    type === ArrowTypes.regular ? 'arrowup' :
        type === ArrowTypes.blue ? 'bluearrow' :
            type === ArrowTypes.red ? 'redarrow' : null
);

class Arrow extends Phaser.GameObjects.Sprite {
    constructor(game, type = ArrowTypes.regular) {
        super(game, game.player.x, game.player.y, arrowImg(type));
        this.type = type;
        const {direction} = game.player;
        this.angle = arrowRotation(direction);
        this.percentWaggle = 0;
        this.waggleDirection = directions.left;
        this.direction = direction;
        this.game = game;
        game.add.existing(this);
        game.projectiles.add(this);
        game.physics.world.enableBody(this);
        this.setScale(2);
        this.setInteractive();
        this.uses = (type === ArrowTypes.regular ? 1 :
                        type === ArrowTypes.red ? 100 :
                            type === ArrowTypes.blue ? 3 : 1);
        const speed = (type === ArrowTypes.regular ? 500 :
            type === ArrowTypes.red ? 1000 :
                type === ArrowTypes.blue ? 750 : 1);
        if (direction === directions.right) {
            this.x += 20;
            this.body.velocity.x = speed;
        } else if (direction === directions.left) {
            this.x -= 20;
            this.body.velocity.x = -1 * speed;
        } else if (direction === directions.up) {
            this.y -= 20;
            this.body.velocity.y = -1 * speed;
        } else if (direction === directions.down) {
            this.y += 20;
            this.body.velocity.y = speed;
        }
    }

    update() {
        if (this.percentWaggle >= 1) {
            this.waggleDirection = directions.right;
        } else if (this.percentWaggle <= 0) {
            this.waggleDirection = directions.left;
        }
        if (this.waggleDirection === directions.left) {
            this.percentWaggle += 1/3;
        } else {
            this.percentWaggle -= 1/3;
        }
        let waggle = this.percentWaggle;
        //const alpha = ((new Date()).getTime() - this.game.initCreateTime.getTime()) / 300;
        this.angle = arrowRotation(this.direction) + (waggle * 10);
        if (this.y > totalWidth || this.x > totalWidth || this.y < 0 || this.x < 0) {
            this.destroy();
            // console.log('arrow destroyed');
        }
    }
}
