
class MainScene extends Phaser.Scene {
    constructor() {
        super('Scene');
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('coin', 'assets/coin.png');
        this.load.image('block', 'assets/block.png');
        this.load.image('floor', 'assets/floor.png');
        this.load.image('spawn', 'assets/spawn.png');
        this.load.image('linkdown', 'assets/linkdown.png');
        this.load.image('linkleft', 'assets/linkleft.png');
        this.load.image('linkright', 'assets/linkright.png');
        this.load.image('linkup', 'assets/linkup.png');
        this.load.image('arrowup', 'assets/arrowup.png');
        this.load.image('arrowdown', 'assets/arrowdown.png');
        this.load.image('arrowright', 'assets/arrowright.png');
        this.load.image('arrowleft', 'assets/arrowleft.png');
        this.load.image('fire1', 'assets/fire1.png');
    }

    create() {
        this.physics.world.setBoundsCollision();
        this.initCreateTime = new Date();
        this.difficulty = 1;

        this.level = new Level(this);

        this.player = new Player(this);
        // this.coin = this.physics.add.sprite(300, 200, 'coin');
        //
        this.score = 0;
        this.hp = 100;
        let style = { font: '20px Arial', fill: '#fff' };
        this.scoreText = this.add.text(32, 32, 'score: ' + this.score, style);
        this.hpText = this.add.text(32, 64, 'hp: ' + this.hp, style);

        this.projectiles = this.physics.add.group();
        this.enemies = this.physics.add.group();


        this.physics.add.collider(this.player, this.level.blocks, () => {
            // console.log('yeeee');
            this.player.x = this.lastX;
            this.player.y = this.lastY;
        });

        this.physics.add.collider(this.player, this.enemies, (p, e) => {
            console.log('enemenies');
            e.destroy();
            this.hp -= 5;
            this.hpText.setText('hp: ' + this.hp);
        });

        this.physics.add.collider(this.enemies, this.projectiles, (e, p) => {
            console.log('ARROW COLLIDE');
            this.projectiles.kill(p);
            this.enemies.kill(e);
            e.destroy();
            p.destroy();
            this.score += 10;
            this.scoreText.setText('score: ' + this.score);
        });
    }

    update() {
        const now = new Date();
        if (parseInt(((now.getTime() - this.initCreateTime.getTime()) / 3000) + '') > this.difficulty) {
            this.difficulty++;
            this.spawnRound();
            this.projectiles.clear(true, true);
        }

        const {x, y} = this.player;
        this.lastX = x;
        this.lastY = y;
        this.player.update();

        for (let child of [...this.enemies.getChildren(), ...this.projectiles.getChildren()]) {
            child.update();
        }
    }

    spawnRound() {
        const potentialEnemies = [
            Fireball
        ];

        for (let i = 0; i < this.difficulty; i++) {
            new Fireball(this);
        }
    }
}

new Phaser.Game({
    pixelArt: true,
    width: (16 * 2) * 11,
    height: (16 * 2) * 11,
    backgroundColor: '#3498db',
    scene: MainScene,
    physics: { default: 'arcade' },
    parent: 'game',
});
