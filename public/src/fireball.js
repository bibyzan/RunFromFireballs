const randomCorner = () => {
    let halfW = blockWidth / 2;
    let randX = (parseInt(Phaser.Math.Between(0, 1)) === 0 ? spawnBlockS : spawnBlockF) * blockWidth - halfW;
    let randY = (parseInt(Phaser.Math.Between(0, 1)) === 0 ? spawnBlockS : spawnBlockF) * blockWidth - halfW;
    return {
        x: randX, y: randY,
    };
}

class Fireball extends Phaser.GameObjects.Sprite {
    constructor(game, lv = 1) {
        super(game, 100, 100, `fire${lv}`);
        this.game = game;
        game.add.existing(this);
        game.physics.world.enableBody(this);
        game.enemies.add(this);
        this.setScale(2);
        this.setInteractive();
        this.level = lv;
        const {x, y} = randomCorner();
        this.x = x;
        this.y = y;
    }

    update() {
        this.level = 0.5;
        if (this.y > this.game.player.y) {
            this.y -= this.level;
        } else {
            this.y += this.level;
        }
        if (this.x > this.game.player.x) {
            this.x -= this.level;
        } else {
            this.x += this.level;
        }
        if (this.y > totalWidth || this.x > totalWidth || this.y < 0 || this.x < 0) {
            this.destroy();
            console.log('fireball destroyed');
        }
    }
}
