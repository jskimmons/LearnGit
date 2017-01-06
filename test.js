var game = new Phaser.Game(800, 600, Phaser.AUTO, '',
    { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

}

var player;
var platforms;
var cursors;
var box;
var box2;

var stars;
var score = 0;
var starLocation=0;

var scoreText;
var inputText;
var collectText;

var counter = 0.0;
var theWord = "cat";

var canMove = true;
var canType = false;
var starExists;

function create() {


    //box = new Phaser.Rectangle(770, 0, 50, 600);
    
    //  scaling
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //  Sets world bounds
    game.world.setBounds(0,0,4000,600);

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(getRand(-150,400), getRand(400,800), 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(getRand(-150,400), getRand(400,800), 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the playe
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //box creation/physics

    box = platforms.create(770,30);
    box.scale.setTo(50,600);
    box.enableBody = true;
    box.body.immovable = true;
    box.visible = true;

    game.physics.arcade.enable(box);

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Create a star inside of the 'stars' group
    var star = stars.create(400, 0, 'star');
    starExists = true;

    game.camera.follow(player);

    //  Let gravity do its thing
    star.body.gravity.y = 300;

    //  This just gives each star a slightly random bounce value
    star.body.bounce.y = 0.7 + Math.random() * 0.2;

    //  The score
    scoreText = game.add.text(400, 16, '', { fontSize: '32px', fill: '#000' });
    inputText = game.add.text(400, 200, '', { fontSize: '32px', fill: '#000' });
    collectText = game.add.text(400,16, '', { fontSize: '32px', fill: '#000' });
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addCallbacks(this, null, null, keyPress);
    
    inputText.fixedToCamera = true;
    scoreText.fixedToCamera = true;
    collectText.fixedToCamera = true;
}

function update() {

    // checks if star exists, if it does the camera stays in one spot
    if(!starExists){
        game.camera.follow(player);
    }
    else{
        game.camera.unfollow(player);
    }

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(player, box);


    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    // Controls input from arrow buttons
    if (cursors.left.isDown && canMove)
    {
        emptyText();
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown && canMove)
    {
        emptyText();
        
        if((player.x - counter) >= 200){
            
            counter+=200;
            
            var ground2 = platforms.create(counter*2, game.world.height - 64, 'ground');

            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground2.scale.setTo(2, 2);

            //  This stops it from falling away when you jump on it
            ground2.body.immovable = true;

            //add sky
            sky = game.add.sprite(counter*2, 0, 'sky');
            game.world.sendToBack(sky);
        }
        
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && canMove)
    {
        player.body.velocity.y = -350;
    }

    if(starLocation-200 <= player.x && canMove){
        collectText.text = "Collect the star!";
        box2.visible = true;
    }

}

function collectStar (player, star) {
    collectText.text = "";
    scoreText.text = "Spell " + theWord;

    // Removes the star from the screen
    star.kill();

    //  make character not move
    immobile();

    starExists = false;

    //remove the invisible barrier
    box.kill();

}

function keyPress(char){
    if(canType){
        if(game.input.keyboard.event.keyCode == 8){
            inputText.text = inputText.text.substring(0,inputText.text.length - 1);
        }else if(game.input.keyboard.event.keyCode == 13){
            var userText = inputText.text;
            immobile();
            checkWord(userText);
        }else{
            inputText.text += char;
            var code = char.charCodeAt(0);
        }
    }    
}

function checkWord(userWord){

    if(theWord == userWord){
        //stuff to be implemented later to check word
        inputText.text = "Nice!";
        canMove = true;
        canType = false;
        checkpoint();

    }
    else{
        emptyText();
        scoreText.text = "Try again, Spell " + theWord;
    }
}

function immobile(){
    canMove = false;
    canType = true;
}

function emptyText(){
    inputText.text = "";
    scoreText.text = "";
}

function getRand(min, max) {
  return Math.random() * (max - min) + min;
}

function checkpoint(){
    //get the star location
    starLocation = getRand(player.x+200, player.x + 800);
    //create the star and add its physics
    var star = stars.create(starLocation, 0, 'star');
    star.body.gravity.y = 300;
    star.body.bounce.y = 0.7 + Math.random() * 0.2;

    //do something with like within the players range? SHIT
        //starExists = true;

    //create the platforms with jakes stuff


    //create the invisible barriers

    box = platforms.create(starLocation + 200,30);
    box.scale.setTo(50,600);
    box.enableBody = true;
    box.body.immovable = true;
    box.visible = true;
    game.physics.arcade.enable(box);

    game.physics.arcade.collide(player, box);

    box2 = platforms.create(starLocation - 200,30);
    box2.scale.setTo(50,600);
    box2.enableBody = true;
    box2.body.immovable = true;
    box2.visible = false;
    game.physics.arcade.enable(box2);

    game.physics.arcade.collide(player, box2);


}


