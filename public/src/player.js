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
        this.redArrows = 0;
        this.blueArrows = 0;
        this.modifier = 1;
        this.arrow = game.input.keyboard.createCursorKeys();
        this.spacebar = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.flipOffset = 0;
        this.midStr = '';
    }

    update() {
        const arrow = this.arrow;
        this.flipOffset += 0.1;

        if ([directions.up, directions.down].includes(this.direction) && (arrow.up.isDown || arrow.down.isDown)) {
            if (this.flipOffset >= 1) {
                this.toggleFlipX();
            }
        } else if (Phaser.Input.Keyboard.JustDown(arrow.right)) {
            this.resetFlip();
            this.toggleFlipX();
            if (this.flipOffset >= 1) {
                this.flipOffset = 0;
                if (this.midStr === '') {
                    this.midStr = '2';
                } else {
                    this.midStr = '';
                }
            }
        } else if (Phaser.Input.Keyboard.JustDown(arrow.left)) {
            this.resetFlip();
        }
        if (this.flipOffset >= 1) {
            this.flipOffset = 0;
            if (this.midStr === '') {
                this.midStr = '2';
            } else {
                this.midStr = '';
            }
        }
        const speed = 5 * this.modifier;
        if (this.modifier > 1) {
            this.modifier -= 0.1;
        }
        if (arrow.right.isDown) {
            this.x += speed;
            this.setTexture(`linkleft${this.midStr}`);
            this.direction = directions.right;
        } else if (arrow.left.isDown) {
            this.x -= speed;
            this.setTexture(`linkleft${this.midStr}`);
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
        if (this.spacebar.isDown && this.active && !this.isShooting) {
            // this.game.add.sprite(100, 100, 'linkdown');
            this.isShooting = true;
            let type = ArrowTypes.regular;
            if (this.blueArrows > 0) {
                type = ArrowTypes.blue;
                this.blueArrows -= 1;
                this.game.blueArrowsText.setText('blue arrows: ' + this.blueArrows);
                setTimeout(() => {
                    this.isShooting = false;
                }, 100);
            } else if (this.redArrows > 0) {
                type = ArrowTypes.red;
                this.redArrows -= 1;
                this.game.redArrowsText.setText('red arrows: ' + this.redArrows);
                setTimeout(() => {
                    this.isShooting = false;
                }, 50);
            } else {
                setTimeout(() => {
                    this.isShooting = false;
                }, 400);
            }
            const arr = new Arrow(this.game, type);
        }
    }
}
