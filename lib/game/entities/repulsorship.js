ig.module(
	'game.entities.repulsorship'
)
.requires(
	'impact.entity',
	'game.entities.ship',
	'game.entities.repulsorshot'
)
.defines(function(){

EntityRepulsorship = EntityShip.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 29, y: 30},
	offset: {x: 7, y: 4},
	
	animSheet: new ig.AnimationSheet( 'media/repulsorship.png', 43, 41 ),

	firingSound: new ig.Sound('media/sounds/repulsor.*'),

	cooldown: 0.1,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'off', 1, [0] );
		this.addAnim( 'flying_neutral', 0.1, [1,2] );
		this.addAnim( 'flying_fwd', 0.1, [5,6] );
		this.addAnim( 'flying_rev', 0.1, [3,4] );
		this.addAnim( 'firing_mah_laser', 0.05, [7,8] );
		this.addAnim( 'pain', 0.075, [9,0,9,0], true );
	},
	
	
	update: function() {		
		
		if (ig.input.pressed('shoot')) {
			this.firingSound.play();
		}
		
		// Move!
		this.parent();
	},
	
	fire: function() {
		ig.game.spawnEntity( EntityRepulsorshot, this.pos.x-9, this.pos.y+8 );
		ig.game.spawnEntity( EntityRepulsorshot, this.pos.x+21, this.pos.y+8, {flip:true});
		//this.firingSound.play();
	}
});


});