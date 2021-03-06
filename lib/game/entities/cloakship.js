ig.module(
	'game.entities.cloakship'
)
.requires(
	'impact.entity',
	'game.entities.ship'
)
.defines(function(){

EntityCloakship = EntityShip.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 19, y: 30},
	offset: {x: 8, y: 4},
	
	animSheet: new ig.AnimationSheet( 'media/cloakship.png', 35, 41 ),

	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'off', 1, [0] );
		this.addAnim( 'flying_neutral', 0.1, [1,2] );
		this.addAnim( 'flying_fwd', 0.1, [5,6] );
		this.addAnim( 'flying_rev', 0.1, [3,4] );
		this.addAnim( 'firing_mah_laser', 0.3, [7,8] );
		this.addAnim( 'pain', 0.075, [9,0,9,0], true );
	},
	
	
	update: function() {		
		
		// Move!
		this.parent();
	},
	
	shoot: function() {
		
	}
});


});