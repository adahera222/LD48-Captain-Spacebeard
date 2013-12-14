ig.module(
	'game.entities.lasershot'
)
.requires(
	'impact.entity',
	'impact.entity-pool'
)
.defines(function(){

EntityLasershot = ig.Entity.extend({

	_wmIgnore: true, // This entity will no be available in Weltmeister

	size: {x: 3, y: 3},
	offset: {x: 0, y: 1},
	maxVel: {x: 800, y: 800},
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, // Check Against B - our evil enemy group
	collides: ig.Entity.COLLIDES.PASSIVE,
		
	animSheet: new ig.AnimationSheet( 'media/lasershot.png', 3, 5 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.x = 0;
		this.vel.y = -600;
		this.addAnim( 'idle', 1, [0] );
	},
	
	reset: function( x, y, settings ) {
		// This function is called when an instance of this class is resurrected
		// from the entity pool. (Pooling is enabled at the bottom of this file).
		this.parent( x, y, settings );
		
		this.vel.x = 0;
		this.vel.y = -600;
	},

	update: function() {
		this.parent();
	},
	
	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	check: function( other ) {
		other.receiveDamage( 1, this );
		this.kill();
	}	
});


// If you have an Entity Class that instanced and removed rapidly, such as this 
// Fireball class, it makes sense to enable pooling for it. This will reduce
// strain on the GarbageCollector and make your game a bit more fluid.

// With pooling enabled, instances that are removed from the game world are not 
// completely erased, but rather put in a pool and resurrected when needed.

ig.EntityPool.enableFor( EntityLasershot );


});
