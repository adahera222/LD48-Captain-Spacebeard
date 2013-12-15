ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	'plugins.camera',
	'plugins.touch-button',
	'plugins.impact-splash-loader',
	'plugins.button',
	
	'game.entities.lasership',
	'game.entities.repulsorship',
	'game.entities.tractorship',
	'game.entities.cloakship',
	'game.entities.asteroid',
	'game.entities.sceneasteroid',
	'game.entities.largeenemy',
	'game.entities.smallenemy',

	'game.levels.menu',
	'game.levels.spacetest',
	
	'impact.debug.debug'
)
.defines(function(){
	
ig.Sound.use = [ig.Sound.FORMAT.MP3, ig.Sound.FORMAT.OGG]; //fix loading stall in safari

var shipChoice = EntityLasership;

// Our Main Game class. This will load levels, host all entities and
// run the game.

MyGame = ig.Game.extend({
	
	clearColor: "#131214",
	gravity: 0, // All entities are affected by this
	
	// Load a font
	font: new ig.Font( 'media/dalefont.font.png' ),

	// HUD icons
	heartFull: new ig.Image( 'media/heart-full.png' ),
	heartEmpty: new ig.Image( 'media/heart-empty.png' ),
	coinIcon: new ig.Image( 'media/coin.png' ),
	
	
	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.A, 'left' );
		ig.input.bind( ig.KEY.D, 'right' );
		ig.input.bind( ig.KEY.W, 'up' );
		ig.input.bind( ig.KEY.S, 'down' );
		ig.input.bind( ig.KEY.SPACE, 'shoot' );
		
		this.loadLevel( LevelSpacetest );
	},

	loadLevel: function( data ) {
		// Remember the currently loaded level, so we can reload when
		// the player dies.
		this.currentLevel = data;

		// Call the parent implemenation; this creates the background
		// maps and entities.
		this.parent( data );
		
		this.spawnEntity(shipChoice, 225, 1920);
		
		this.screen.x = 250 - ig.system.width/2;
		this.screen.y = 1920 - ig.system.height/2;
	},

	reloadLevel: function() {
		this.loadLevelDeferred( this.currentLevel );
	},
	
	update: function() {		
		// Update all entities and BackgroundMaps
		this.parent();
		
		// Instead of using the camera plugin, we could also just center
		// the screen on the player directly, like this:
		//this.screen.x = this.player.pos.x - ig.system.width/2;
		//this.screen.y = this.player.pos.y - ig.system.height/2;
		
		if (this.screen.y > 20) {
			this.screen.y -= 0.5;
		}
		
		//keep player ship inside the screen vertically
		if(this.player.pos.y + this.player.size.y + 10 > this.screen.y + ig.system.height) {
			//this.player.pos.y = this.screen.y + ig.system.height - this.player.size.y - 10;
			this.player.vel.y -= 50;
		}
		else if (this.player.pos.y - 10 < this.screen.y) {
			this.player.pos.y = this.screen.y + 10;
		}
		if (this.player.pos.y > this.screen.y + ig.system.height + 60) {
			this.player.kill();
		}
	},
	
	draw: function() {
		// Call the parent implementation to draw all Entities and BackgroundMaps
		this.parent();
		

		// Draw the heart and number of coins in the upper left corner.
		// 'this.player' is set by the player's init method
		if( this.player ) {
			var x = 16, 
				y = 16;

			for( var i = 0; i < this.player.maxHealth; i++ ) {
				// Full or empty heart?
				if( this.player.health > i ) {
					this.heartFull.draw( x, y );
				}
				else {
					this.heartEmpty.draw( x, y );	
				}

				x += this.heartEmpty.width + 8;
			}

			// We only want to draw the 0th tile of coin sprite-sheet
			x += 48;
			this.coinIcon.drawTile( x, y+6, 0, 36 );

			x += 42;
			this.font.draw( 'x ' + this.player.coins, x, y+10 )
		}
		
		// Draw touch buttons, if we have any
		if( window.myTouchButtons ) {
			window.myTouchButtons.draw(); 
		}
	}
});



// The title screen is simply a Game Class itself; it loads the LevelTitle
// runs it and draws the title image on top.

MyTitle = ig.Game.extend({
	clearColor: "#131214",
	gravity: 0,

	// The title image
	title: new ig.Image( 'media/title.png' ),

	// Load a font
	font: new ig.Font( 'media/dalefont.font.png' ),

	init: function() {
		this.font.letterSpacing = 1;

		this.loadLevel( LevelMenu );
		//this.maxY = this.backgroundMaps[0].pxHeight - ig.system.height;
		
		ig.input.bind( ig.KEY.MOUSE1, 'click' );
		
		this.spawnEntity( Button, ig.system.width/2 - 96 - 32, ig.system.height/2 + 100, {
			font: this.font,
			text: ['LASER'],
			textPos: {x: 32, y: 4},
			textAlign: ig.Font.ALIGN.CENTER,
			size: {x: 64, y: 15},
			animSheet: new ig.AnimationSheet('media/button.png', 64, 15),
			zIndex: 2,
			
			pressedUp: function() {
				shipChoice = EntityLasership;
				ig.system.setGame(MyGame);
			}
		});
		this.spawnEntity( EntityLasership, ig.system.width/2 - 96 - 9, ig.system.height/2 + 60);
		this.spawnEntity( Button, ig.system.width/2 - 32 - 32, ig.system.height/2 + 100, {
			font: this.font,
			text: ['REPULSOR'],
			textPos: {x: 32, y: 4},
			textAlign: ig.Font.ALIGN.CENTER,
			size: {x: 64, y: 15},
			animSheet: new ig.AnimationSheet('media/button.png', 64, 15),
			zIndex: 2,
			
			pressedUp: function() {
				shipChoice = EntityRepulsorship;
				ig.system.setGame(MyGame);
			}
		});
		this.spawnEntity( EntityRepulsorship, ig.system.width/2 - 32 - 14, ig.system.height/2 + 60);
		this.spawnEntity( Button, ig.system.width/2 + 32 - 32, ig.system.height/2 + 100, {
			font: this.font,
			text: ['TRACTOR'],
			textPos: {x: 32, y: 4},
			textAlign: ig.Font.ALIGN.CENTER,
			size: {x: 64, y: 15},
			animSheet: new ig.AnimationSheet('media/button.png', 64, 15),
			zIndex: 2,
			
			pressedUp: function() {
				shipChoice = EntityTractorship;
				ig.system.setGame(MyGame);
			}
		});
		this.spawnEntity( EntityTractorship, ig.system.width/2 + 32 - 13, ig.system.height/2 + 60);
		this.spawnEntity( Button, ig.system.width/2 + 96 - 32, ig.system.height/2 + 100, {
			font: this.font,
			text: ['CLOAK'],
			textPos: {x: 32, y: 4},
			textAlign: ig.Font.ALIGN.CENTER,
			size: {x: 64, y: 15},
			animSheet: new ig.AnimationSheet('media/button.png', 64, 15),
			zIndex: 2,
			
			pressedUp: function() {
				shipChoice = EntityCloakship;
				ig.system.setGame(MyGame);
			}
		});
		this.spawnEntity( EntityCloakship, ig.system.width/2 + 96 - 9, ig.system.height/2 + 60);
	},

	update: function() {
		this.parent();

		// Scroll the screen down; apply some damping.
		//var move = this.maxY - this.screen.y;
		//if( move > 5 ) {
		//	this.screen.y += move * ig.system.tick;
		//	this.titleAlpha = this.screen.y / this.maxY;
		//}
		//this.screen.x = (this.backgroundMaps[0].pxWidth - ig.system.width)/2;
	},

	draw: function() {
		this.parent();

		var cx = ig.system.width/2;
		this.title.draw( cx - this.title.width/2, 60 );
	}
});


if( ig.ua.mobile ) {
	// If we're running on a mobile device and not within Ejecta, disable 
	// sound completely :(
	if( !window.ejecta ) {
		ig.Sound.enabled = false;
	}

	// Use the TouchButton Plugin to create a TouchButtonCollection that we
	// can draw in our game classes.
	
	// Touch buttons are anchored to either the left or right and top or bottom
	// screen edge.
	var buttonImage = new ig.Image( 'media/touch-buttons.png' );
	myTouchButtons = new ig.TouchButtonCollection([
		new ig.TouchButton( 'left', {left: 0, bottom: 0}, 128, 128, buttonImage, 0 ),
		new ig.TouchButton( 'right', {left: 128, bottom: 0}, 128, 128, buttonImage, 1 ),
		new ig.TouchButton( 'shoot', {right: 128, bottom: 0}, 128, 128, buttonImage, 2 ),
		new ig.TouchButton( 'jump', {right: 0, bottom: 96}, 128, 128, buttonImage, 3 )
	]);
}

// If our screen is smaller than 640px in width (that's CSS pixels), we scale the 
// internal resolution of the canvas by 2. This gives us a larger viewport and
// also essentially enables retina resolution on the iPhone and other devices 
// with small screens.
var scale = (window.innerWidth < 640) ? 1 : 0.5;


// We want to run the game in "fullscreen", so let's use the window's size
// directly as the canvas' style size.
var canvas = document.getElementById('canvas');
canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';


// Listen to the window's 'resize' event and set the canvas' size each time
// it changes.
window.addEventListener('resize', function(){
	// If the game hasn't started yet, there's nothing to do here
	if( !ig.system ) { return; }
	
	// Resize the canvas style and tell Impact to resize the canvas itself;
	canvas.style.width = window.innerWidth + 'px';
	canvas.style.height = window.innerHeight + 'px';
	ig.system.resize( window.innerWidth * scale, window.innerHeight * scale );
	
	// Re-center the camera - it's dependend on the screen size.
	if( ig.game && ig.game.setupCamera ) {
		ig.game.setupCamera();
	}
	
	// Also repositon the touch buttons, if we have any
	if( window.myTouchButtons ) {
		window.myTouchButtons.align(); 
	}
}, false);


// Finally, start the game into MyTitle and use the ImpactSplashLoader plugin 
// as our loading screen
var width = window.innerWidth * scale,
	height = window.innerHeight * scale;
ig.main( '#canvas', MyTitle, 60, width, height, 2, ig.ImpactSplashLoader );

});
