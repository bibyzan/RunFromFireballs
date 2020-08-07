'use strict';

const scale = 2;
const blocksLen = 11;
const blockWidth = 16 * scale;
const totalWidth = blocksLen * blockWidth;
const startI = blockWidth / 2;
const lastP = totalWidth - (blockWidth / 2);
const midI = (startI + lastP) / 2;

const isBlock = (x, y) => (
    ([x, y].includes(startI) || [x, y].includes(lastP))
);

const quarterP = (startI + lastP) / 3;
const threeQuarterP = midI + quarterP;

const spawnBlockS = 3;
const spawnBlockF = 9;

const isSpawn = (x, y) => (
    (((x + startI) / blockWidth) === spawnBlockS &&
        ((y + startI) / blockWidth) === spawnBlockS) ||
    (((x + startI) / blockWidth) === spawnBlockF &&
        ((y + startI) / blockWidth) === spawnBlockF) ||
    (((x + startI) / blockWidth) === spawnBlockS &&
        ((y + startI) / blockWidth) === spawnBlockF) ||
    (((x + startI) / blockWidth) === spawnBlockF &&
        ((y + startI) / blockWidth) === spawnBlockS)
);

class Level {
    constructor(game) {
        this.blocks = game.physics.add.group();
        this.floorTiles = game.physics.add.group();
        for (let x = startI; x < totalWidth; x += blockWidth) {
            for (let y = startI; y < totalWidth; y += blockWidth) {
                if (isBlock(x, y)) {
                    let b = game.physics.add.sprite(x, y, 'block');
                    b.setCollideWorldBounds(true);
                    b.setScale(2);
                    this.blocks.add(b);
                } else if (isSpawn(x, y)) {
                    let b = game.physics.add.image(x, y, 'spawn');
                    b.setScale(2);
                    this.floorTiles.add(b);
                } else {
                    let b = game.physics.add.image(x, y, 'floor');
                    b.setScale(2);
                    this.floorTiles.add(b);
                }
            }
        }
    }

    checkCollide(obj) {

    }
}
