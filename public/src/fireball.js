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
        this.brake = 1;
        this.level = lv;
        const {x, y} = randomCorner();
        this.x = x;
        this.y = y;
        this.speed = lv * 0.5;
        this.flipOffset = 0;
    }

    update() {
        let speed = this.speed;
        if (this.level !== 5) {
            this.flipOffset += 0.1;
            if (this.flipOffset >= 1) {
                this.toggleFlipX(!this.flipX);
                this.flipOffset = 0;
            }
        }
        if (this.level === 4 || this.level === 5) {
            if (this.brake <= 0 && !this.timingOut) {
                this.timingOut = true;
                setTimeout(() => {
                    this.brake = 1;
                    this.timingOut = false;
                }, 2000);
            } else if (this.brake >= 0 && this.brake <= 1) {
                this.brake -= 0.01;
                speed *= this.brake;
            }
        }
        const checkY = () => {
            if (this.y > this.game.player.y) {
                // this.body.velocity.y = -1 * speed;
                this.y -= speed;
                if (this.y < this.game.player.y) {
                    this.y = this.game.player.y;
                }
            } else {
                // this.body.velocity.y = speed;
                this.y += speed;
                if (this.y > this.game.player.y) {
                    this.y = this.game.player.y;
                }
            }
        };
        const checkX = () => {
            if (this.x > this.game.player.x) {
                this.x -= speed;
                // this.body.velocity.x = -1 * speed;
                if (this.x < this.game.player.x) {
                    this.x = this.game.player.x;
                }
            } else {
                this.x += speed;
                // this.body.velocity.x = speed;
                if (this.x > this.game.player.x) {
                    this.x = this.game.player.x;
                }
            }
        };
        if (this.level === 1) {
            if (this.y !== this.game.player.y) {
                checkY();
            } else {
                checkX();
            }
        } else if (this.level === 2) {
            if (this.y !== this.game.player.y) {
                checkY();
            } else {
                checkX();
            }
        } else if (this.level === 3) {
            parseInt(Phaser.Math.Between(0, 1)) === 0 ? checkY() : checkX();
        } else if (this.level === 4 || this.level === 5) {
            checkX();
            checkY();
        }
        if (this.y > totalWidth || this.x > totalWidth || this.y < 0 || this.x < 0) {
            this.destroy();
            // console.log('fireball destroyed');
        }
    }
}
