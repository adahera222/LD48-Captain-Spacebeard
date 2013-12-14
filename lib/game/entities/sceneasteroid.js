ig.module(
	'game.entities.sceneasteroid'
)
.requires(
	'impact.entity'
	
)
.defines(function(){

EntitySceneasteroid = ig.Entity.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 48, y: 36},
	offset: {x: 1, y: 4},
	
	maxVel: {x: 50, y: 50},
	friction: {x: 300, y: 300},
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.FIXED,
	
	health: 9001,
	dmg: 0,
	
	animSheet: new ig.AnimationSheet( 'media/asteroid.png', 51, 43 ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
	},
	
	
	update: function() {		
		this.parent();
	},
	
	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	check: function( other ) {
		//other.receiveDamage(this.dmg, this);
	}	
});


});