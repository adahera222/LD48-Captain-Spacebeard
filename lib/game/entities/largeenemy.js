ig.module(
	'game.entities.largeenemy'
)
.requires(
	'impact.entity',
	'game.entities.lasershotenemy'
	
)
.defines(function(){

EntityLargeenemy = ig.Entity.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 106, y: 16},
	offset: {x: 4, y: 7},
	
	maxVel: {x: 40, y: 40},
	friction: {x: 300, y: 300},
	
	type: ig.Entity.TYPE.B, // enemy
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.ACTIVE,
	
	health: 10,
	maxhealth: 10,
	dmg: 2,
	
	cooldown: 0.95,
	
	start: {x: 0, y: 0},
	movingRight: true,
	
	animSheet: new ig.AnimationSheet( 'media/largeenemy.png', 114, 26 ),
	
	sfxHurt: new ig.Sound( 'media/sounds/enemy_hurt.*' ),
	sfxExplode: new ig.Sound( 'media/sounds/explosion.*'),
	firingSound: new ig.Sound('media/sounds/lasershoot.*'),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.start.x = x;
		this.start.y = y;
		
		// Add the animations
		this.addAnim( 'idle', 0.1, [0,1] );
		this.addAnim( 'pain', 0.075, [3,2], true );
		this.addAnim( 'explode', 0.15, [3,4,5,6,7], true)
	},
	
	
	update: function() {		
		// animate
		
		// Stay in the pain animation, until it has looped through.
		// If not in pain, set the current animation, based on the 
		// player's speed
		if( 
			(this.currentAnim == this.anims.pain || this.currentAnim == this.anims.explode) &&
			this.currentAnim.loopCount < 1
		) {
			// If we're dead, fade out
			if( this.health <= 0 ) {
				// The pain animation is 0.3 seconds long, so in order to 
				// completely fade out in this time, we have to reduce alpha
				// by 3.3 per second === 1 in 0.3 seconds
				//var dec = (1/this.currentAnim.frameTime) * ig.system.tick;
				//this.currentAnim.alpha = (this.currentAnim.alpha - dec).limit(0,1);
			}
		}
		else if( this.health <= 0 ) {
			// We're actually dead and the death (pain) animation is 
			// finished. Remove ourself from the game world.
			this.kill();
		}
		else {
			this.currentAnim = this.anims.idle;
		}
		
		//fire weapon
		if (!this.cooldownTimer || this.cooldownTimer.delta() >= 0 ) {
			this.cooldownTimer = new ig.Timer();
			this.cooldownTimer.set(this.cooldown);
			this.fire();
		}
		
		//move side to side
		/*if (this.movingRight && this.pos.x > this.start.x + 100) {
			this.movingRight = false;
		}
		else if (!this.movingRight && this.pos.x < this.start.x - 100) {
			this.movingRight = true;
		}*/
		
		if (!this.directionTimer || this.directionTimer.delta() >= 0) {
			this.directionTimer = new ig.Timer();
			this.directionTimer.set(2.5);
			this.movingRight = !this.movingRight;
		}
		
		if (this.movingRight) {
			this.accel.x = 500;
		}
		else {
			this.accel.x = -500;
		}
		
		this.parent();
	},
	
	receiveDamage: function( amount, from ) {
		this.health -= amount;
		
		if( this.health <= 0 ) {
			this.currentAnim = this.anims.explode.rewind();
			this.sfxExplode.play();
			return;
		}
		
		if( this.currentAnim == this.anims.pain ) {
			// Already in pain? Do nothing.
			return;
		}

		// We don't call the parent implementation here, because it 
		// would call this.kill() as soon as the health is zero. 
		// We want to play our death (pain) animation first.
		this.currentAnim = this.anims.pain.rewind();

		// Knockback
		//this.vel.x = (from.pos.x > this.pos.x) ? -400 : 400;
		//this.vel.y = -300;
		
		// Sound
		this.sfxHurt.play();
	},
	
	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	check: function( other ) {
		other.receiveDamage(this.dmg, this);
	},
	
	fire: function() {
		ig.game.spawnEntity( EntityLasershotenemy, this.pos.x+1, this.pos.y+16 );
		ig.game.spawnEntity( EntityLasershotenemy, this.pos.x+36, this.pos.y+16 );
		ig.game.spawnEntity( EntityLasershotenemy, this.pos.x+66, this.pos.y+16 );
		ig.game.spawnEntity( EntityLasershotenemy, this.pos.x+102, this.pos.y+16 );
		//this.firingSound.play();
	}
});


});