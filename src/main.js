import './style.css'
import Phaser from 'phaser'

const sizes={
  width:1024,
  height:1024
}

const speedDown=300
const NUM_ENEMIES=5

const FRAME_HEIGHT=540
const FRAME_WIDTH=960

const gameStartDiv = document.querySelector("#gameStartDiv")
const gameStartBtn = document.querySelector("#gameStartBtn")
const gameEndDiv = document.querySelector("#gameEndDiv")
const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan")

class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game")
    this.player
    this.cursor
    this.playerSpeed=speedDown+50
    this.targets
    this.points = 0
    this.playersRemaining = NUM_ENEMIES + 1
    this.textScore
    this.textTime
    this.timedEvent
    this.remainingTime
    this.coinMusic
    this.emitter
    this.playerDead
    this.map
  }

  preload(){
    this.load.image("bg", "/assets/map.png")
    this.load.image("player", "/assets/player.png")
    this.load.image("enemy", "/assets/enemy.png")
    this.load.audio("coin", "/assets/coin.mp3")
    this.load.image("money", "/assets/money.png")
    this.load.tiledmapTiledJSON("map", "/assets/blankmap.tmj")
    this.load.image("tiles", "/assets/blanktileset.png")
  }

  create(){

    this.scene.pause("scene-game")
  
    this.coinMusic = this.sound.add("coin")

    this.physics.world.setBounds(0, 0, sizes.width, sizes.height)

    this.cameras.main.setBounds(0, 0, FRAME_WIDTH, FRAME_HEIGHT)

    const map = this.make.tilemap({ key: "map" })
    this.map = map

    const tileset = map.addTilesetImage("blanktileset", "tiles")
    map.createLayer(0, tileset, 0, 0)

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

    this.player = this.physics.add
      .image(0,sizes.height-100, "player")
      .setOrigin(0,0)
    this.player.setImmovable(true)
    this.player.body.allowGravity = false
    this.player.setCollideWorldBounds(true)

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08)
    this.cameras.main.setZoom(1.5)


    this.targets = this.physics.add.group({
      allowGravity: false,
      maxVelocityY: speedDown
    })
    for (let i = 0; i < NUM_ENEMIES; i++) {
      const target = this.physics.add.image(this.getRandomX(), this.getRandomY(), "enemy").setOrigin(0, 0);
      target.setImmovable(true);
      //target.body.allowGravity = false;
      //target.setMaxVelocity(0, speedDown);
      this.targets.add(target);
    }

    this.physics.add.overlap(this.player, this.targets, this.targetHit, null, this)
    
    this.cursor=this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    })

    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#0000000",
    });
    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "25px Arial",
      fill: "#0000000",
    });

    //this.timedEvent = this.time.delayedCall(10000, this.gameOver, [], this)

    this.emitter=this.add.particles(0,0,"money", {
      speed:100,
      gravityY:speedDown-200,
      scale:0.04,
      duration:100,
      emitting:false
    })
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true)
  }

  update(){
    //this.remainingTime = this.timedEvent.getRemainingSeconds()
    //this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`)

    
    const {left, right, down, up} = this.cursor

    if (left.isDown){
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown){
      this.player.setVelocityX(this.playerSpeed);
    } else{
      this.player.setVelocityX(0);
    }

    if (up.isDown){
      this.player.setVelocityY(-this.playerSpeed);
    } else if (down.isDown){
      this.player.setVelocityY(this.playerSpeed);
    } else{
      this.player.setVelocityY(0);
    }

    if (this.playersRemaining == 1 || this.playerDead) {
      this.gameOver()
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * sizes.width);
  }
  getRandomY() {
    return Math.floor(Math.random() * sizes.height);
  }

  targetHit(player, target) {
    this.coinMusic.play()
    //this.emitter.start()
    target.destroy()
    this.textScore.setText(`Score: ${this.points}`)
    this.playersRemaining--
  }

  gameOver(){
    this.sys.game.destroy(true)
    if(this.playersRemaining == 1){
      gameEndScoreSpan.textContent = this.points
      gameWinLoseSpan.textContent = "Win!"
    } else {
      gameEndScoreSpan.textContent = this.points
      gameWinLoseSpan.textContent = "Lose!"
    }

    gameEndDiv.style.display = "flex"
  }
}

const config = {
  type:Phaser.WEBGL,
  width:sizes.width,
  height:sizes.height,
  canvas:gameCanvas,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_VERTICALLY
  },
  physics:{
    default:"arcade",
    arcade:{
      gravity:{y:speedDown},
      debug:true
    }
  },
  scene:[GameScene]
}

const game = new Phaser.Game(config)

gameStartBtn.addEventListener("click", ()=>{
  gameStartDiv.style.display="none"
  game.scene.resume("scene-game")

  const audio = new Audio("/assets/start2.wav")
  audio.volume = 0.3
  audio.play()
})