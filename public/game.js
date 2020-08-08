const addScore = (name, score) => {
    (async () => {
        try {
            const response = await fetch(`https://webhooks.mongodb-realm.com/api/client/v2.0/app/runfromfireballs-pbrmb/service/HTTP/incoming_webhook/addScore?name=${name}&score=${score}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            console.log(response.json());
            getHighScores();
        } catch (e) {
            console.error(e);
        }
    })();
};

const getHighScores = () => {
    (async () => {
        try {
            const response = await fetch('https://webhooks.mongodb-realm.com/api/client/v2.0/app/runfromfireballs-pbrmb/service/HTTP/incoming_webhook/getScores', {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            let scoresDiv = document.getElementById('scores');
            let scores = '<h3>High scores</h3>';
            for (let score of (await response.json()).sort((a, b) => (parseInt(a.score) < parseInt(b.score)))) {
                scores += `<p>${score.name}: ${score.score}</p>`
            }
            scoresDiv.innerHTML = scores;
            //console.log(response.json());
        } catch (e) {
            console.error(e);
        }
    })();
}

window.addEventListener('load', () => {
    getHighScores();
});

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
        this.load.image('linkleft2', 'assets/linkleft2.png');
        this.load.image('linkup', 'assets/linkup.png');
        this.load.image('arrowup', 'assets/arrowup.png');
        this.load.image('bluearrow', 'assets/bluearrow.png');
        this.load.image('redarrow', 'assets/redarrow.png')
        this.load.image('fire1', 'assets/fire1.png');
        this.load.image('fire2', 'assets/fire2.png');
        this.load.image('fire3', 'assets/fire3.png');
        this.load.image('fire4', 'assets/fire4.png');
        this.load.image('fire5', 'assets/fire5.png');
        this.load.image('bluepowerup', 'assets/bluepowerup.png');
        this.load.image('heart', 'assets/heart.png');
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
        this.roundText = this.add.text(32, 96, 'round: ' + this.difficulty, style);
        this.redArrowsText = this.add.text(32, 128, 'red arrows: ' + this.player.redArrows, style);
        this.blueArrowsText = this.add.text(32, 160, 'blue arrows: ' + this.player.blueArrows, style);

        this.projectiles = this.physics.add.group();
        this.enemies = this.physics.add.group();

        this.blueArrows = this.physics.add.group();
        this.redArrows = this.physics.add.group();
        this.speedBoosts = this.physics.add.group();
        this.hearts = this.physics.add.group();

        this.physics.add.overlap(this.player, this.blueArrows, (p,b) => (this.blueCollide(p, b)));
        this.physics.add.overlap(this.player, this.redArrows, (p,b) => (this.redCollide(p, b)));
        this.physics.add.overlap(this.player, this.speedBoosts, (p,b) => (this.boostCollide(p, b)));
        this.physics.add.overlap(this.player, this.hearts, (p, b) => (this.heartCollide(p, b)));

        this.physics.add.overlap(this.projectiles, this.blueArrows, (p,b) => (this.blueCollide(p, b)));
        this.physics.add.overlap(this.projectiles, this.redArrows, (p,b) => (this.redCollide(p, b)));
        this.physics.add.overlap(this.projectiles, this.speedBoosts,  (p,b) => (this.boostCollide(p, b)));
        this.physics.add.overlap(this.projectiles, this.hearts, (p, b) => (this.heartCollide(p, b)));

        this.physics.add.collider(this.player, this.level.blocks, () => {
            // console.log('yeeee');
            this.player.x = this.lastX;
            this.player.y = this.lastY;
        });

        this.physics.add.overlap(this.player, this.enemies, (p, e) => {
            console.log('enemenies');
            e.destroy();
            this.hp -= 5;
            this.hpText.setText('hp: ' + this.hp);
            this.tweens.add({
                targets: this.player,
                duration: 200,
                scaleX: 1.5,
                scaleY: 1.5,
                yoyo: true,
            });
            if (this.hp <= 0) {
                this.player.destroy();
                let name = window.prompt('Game Over! your score was: ' + this.score, 'Enter Name');
                if (name !== 'Enter Name' && name !== '') {
                    addScore(name, this.score);
                }
            }
        });

        this.physics.add.overlap(this.enemies, this.projectiles, (e, p) => {
            console.log('ARROW COLLIDE');
            // this.projectiles.kill(p);
            // this.enemies.kill(e);
            e.destroy();
            p.uses -= 1;
            if (p.uses <= 0) {
                p.destroy();
            }
            this.score += 10;
            this.scoreText.setText('score: ' + this.score);
        });
    }

    blueCollide(c, arrow) {
        arrow.destroy();
        this.player.blueArrows += 10;
        this.blueArrowsText.setText('blue arrows: ' + this.player.blueArrows);
    }

    redCollide(c, arrow) {
        arrow.destroy();
        this.player.redArrows += 10;
        this.redArrowsText.setText('red arrows: ' + this.player.redArrows);
    }

    boostCollide(c, boost) {
        boost.destroy();
        this.player.modifier += 0.5;
        this.tweens.add({
            targets: this.player,
            duration: 200,
            scaleX: 2.5,
            scaleY: 2.5,
            yoyo: true,
        });
    }

    heartCollide(c, heart) {
        heart.destroy();
        this.hp += 10;
        this.hpText.setText('hp: ' + this.hp);
        this.tweens.add({
            targets: this.player,
            duration: 200,
            scaleX: 2.5,
            scaleY: 2.5,
            yoyo: true,
        });
    }

    update() {
        const now = new Date();
        if (parseInt(((now.getTime() - this.initCreateTime.getTime()) / 3000) + '') > 1 && this.enemies.getChildren().length === 0) {
            console.log('ROUND')
            this.initCreateTime = new Date();
            this.difficulty++;
            this.roundText.setText('round: ' + this.difficulty);
            this.spawnRound();
            // this.projectiles.clear(true, true);
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
        for (let i = 0; i < this.difficulty; i++) {
            let max = this.difficulty + 1;
            if (max > 5) {
                max = 5
            }
            new Fireball(this, parseInt(Phaser.Math.Between(1, max)));
            const x = Phaser.Math.Between(startI + blockWidth, totalWidth - (blockWidth + startI));
            const y = Phaser.Math.Between(startI + blockWidth, totalWidth - (blockWidth + startI))
            if (parseInt(Phaser.Math.Between(0, 1)) === 0) {
                let red = this.physics.add.image(x, y, 'redarrow');
                red.setScale(2);
                this.redArrows.add(red);
            } else if (parseInt(Phaser.Math.Between(0, 1)) === 0) {
                let bluePower = this.physics.add.image(x, y, 'bluepowerup');
                bluePower.setScale(2);
                this.speedBoosts.add(bluePower);
            } else if (parseInt(Phaser.Math.Between(0, 1)) === 0) {
                let heart = this.physics.add.image(x, y, 'heart');
                heart.setScale(2);
                this.hearts.add(heart);
            } else {
                let blue = this.physics.add.image(x, y, 'bluearrow');
                blue.setScale(2);
                this.blueArrows.add(blue);
            }
                //let randX = (parseInt(Phaser.Math.Between(0, 1)) === 0 ? spawnBlockS : spawnBlockF) * blockWidth - halfW;
            // new Fireball(this);
        }
    }
}

new Phaser.Game({
    pixelArt: true,
    width: totalWidth,
    height: totalWidth,
    backgroundColor: '#3498db',
    scene: MainScene,
    physics: { default: 'arcade' },
    parent: 'game',
});
