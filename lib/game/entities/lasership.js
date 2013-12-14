ig.module(
	'game.entities.lasership'
)
.requires(
	'impact.entity',
	'game.entities.ship',
	'game.entities.lasershot'
)
.defines(function(){

EntityLasership = EntityShip.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 19, y: 30},
	offset: {x: 8, y: 4},
	
	animSheet: new ig.AnimationSheet( 'media/lasership.png', 35, 41 ),
	
	firingSound: new ig.Sound('media/sounds/lasershoot.*'),

	cooldown: 0.4,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'off', 1, [0] );
		this.addAnim( 'flying_neutral', 0.1, [1,2] );
		this.addAnim( 'flying_fwd', 0.1, [5,6] );
		this.addAnim( 'flying_rev', 0.1, [3,4] );
		this.addAnim( 'firing_mah_laser', 0.2, [7,3] );
		this.addAnim( 'pain', 0.075, [8,0,8,0], true );
	},
	
	
	update: function() {		
		
		// Move!
		this.parent();
	},
	
	fire: function() {
		ig.game.spawnEntity( EntityLasershot, this.pos.x-7, this.pos.y+8 );
		ig.game.spawnEntity( EntityLasershot, this.pos.x+23, this.pos.y+8 );
		this.firingSound.play();
	}
});


});