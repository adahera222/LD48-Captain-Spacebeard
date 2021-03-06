ig.module(
	'game.entities.ship'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityShip = ig.Entity.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 19, y: 30},
	offset: {x: 8, y: 4},
	
	maxVel: {x: 250, y: 250},
	friction: {x: 2200, y: 2200},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	sfxHurt: new ig.Sound( 'media/sounds/player_hurt.*' ),
	sfxExplode: new ig.Sound('media/sounds/explosion.*'),
	
	player:false,
	
	health: 3,

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	flip: false,
	accelX: 2400,
	accelY: 2400,
	maxHealth: 3,
	
	cooldown: 0.6,
	
	angle: 0,

	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.angle = settings.angle || 0;
		
		// Set a reference to the player on the game instance
		if (settings.player == true) {
			ig.game.player = this;
			this.player = true;
		}
	},
	
	
	update: function() {

		if (this.angle != 0) {
			this.currentAnim.angle = this.angle;
		}
		
		// Handle user input
		if (this.player) {
			this.accel.x = 0;
			if( ig.input.state('left') ) {
				this.accel.x += -this.accelX;
			}
			if( ig.input.state('right') ) {
				this.accel.x += this.accelX;
			}
			
			this.accel.y = 0;
			if( ig.input.state('up') ) {
				this.accel.y += -this.accelY;
			}
			if( ig.input.state('down') ) {
				this.accel.y += this.accelY;
			}
			
			// shoot
			if( ig.input.state('shoot') ) {
				this.shoot();
			}
		}
		
		
		// animate
		
		// Stay in the pain animation, until it has looped through.
		// If not in pain, set the current animation, based on the 
		// player's speed
		if( 
			this.currentAnim == this.anims.pain &&
			this.currentAnim.loopCount < 1
		) {
			// If we're dead, fade out
			if( this.health <= 0 ) {
				// The pain animation is 0.3 seconds long, so in order to 
				// completely fade out in this time, we have to reduce alpha
				// by 3.3 per second === 1 in 0.3 seconds
				var dec = (1/this.currentAnim.frameTime) * ig.system.tick;
				this.currentAnim.alpha = (this.currentAnim.alpha - dec).limit(0,1);
			}
		}
		else if( this.health <= 0 ) {
			// We're actually dead and the death (pain) animation is 
			// finished. Remove ourself from the game world.
			this.kill();
		}
		else if( this.currentAnim == this.anims.firing_mah_laser && this.currentAnim.loopCount < 1 ) {
			
		}
		else if(ig.input.state('up')) {
			this.currentAnim = this.anims.flying_fwd;
		}
		else if (ig.input.state('down')) {
			this.currentAnim = this.anims.flying_rev;
		}
		else {
			this.currentAnim = this.anims.flying_neutral;
		}
		
		if (!this.player) {
			this.currentAnim = this.anims.off;
		}
		
		
		// Move!
		this.parent();
	},

	kill: function() {
		this.sfxExplode.play();
		
		this.parent();

		// Reload this level
		ig.game.reloadLevel();
	},

	receiveDamage: function( amount, from ) {
		if( this.currentAnim == this.anims.pain ) {
			// Already in pain? Do nothing.
			return;
		}

		// We don't call the parent implementation here, because it 
		// would call this.kill() as soon as the health is zero. 
		// We want to play our death (pain) animation first.
		this.health -= amount;
		this.currentAnim = this.anims.pain.rewind();

		// Knockback
		//this.vel.x = (from.pos.x > this.pos.x) ? -400 : 400;
		//this.vel.y = -300;
		
		// Sound
		this.sfxHurt.play();
	},
	
	shoot: function() {
		if (!this.cooldownTimer || this.cooldownTimer.delta() >= 0 ) {
			this.cooldownTimer = new ig.Timer();
			this.cooldownTimer.set(this.cooldown);
			this.fire();
			this.currentAnim = this.anims.firing_mah_laser;
			this.currentAnim.rewind();
		}
	}
});


});