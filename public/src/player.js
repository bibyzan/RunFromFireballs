
const directions = {
    up: 'up',
    down: 'down',
    right: 'right',
    left: 'left'
};

class Player extends Phaser.GameObjects.Sprite {
    constructor(game) {
        super(game, 100, 100, 'linkdown');
        game.add.existing(this);
        game.physics.world.enableBody(this);
        // super.setCollideWorldBounds(true);
        this.game = game;
        this.direction = directions.down;
        this.setScale(2);
        this.arrow = game.input.keyboard.createCursorKeys();
        this.spacebar = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        const arrow = this.arrow;
        const speed = 5;
        if (arrow.right.isDown) {
            this.x += speed;
            this.setTexture('linkright');
            this.direction = directions.right;
        } else if (arrow.left.isDown) {
            this.x -= speed;
            this.setTexture('linkleft');
            this.direction = directions.left;
        }
        if (arrow.down.isDown) {
            this.y += speed;
            this.setTexture('linkdown');
            this.direction = directions.down;
        } else if (arrow.up.isDown) {
            this.y -= speed;
            this.setTexture('linkup');
            this.direction = directions.up;
        }
        if (Phaser.Input.Keyboard.JustDown(this.spacebar) && this.active) {
            // this.game.add.sprite(100, 100, 'linkdown');
            const arr = new Arrow(this.game);
        }
    }
}
