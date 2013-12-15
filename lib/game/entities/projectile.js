ig.module(
	'game.entities.projectile'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityProjectile = ig.Entity.extend({

	_wmIgnore: true, // This entity will no be available in Weltmeister

	size: {x: 3, y: 3},
	offset: {x: 0, y: 1},
	maxVel: {x: 800, y: 800},
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, // Check Against B - our evil enemy group
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	life: 1,
	velocity: -600,
	dmg: 1,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.x = 0;
		this.vel.y = this.velocity;
		
		this.lifeTimer = new ig.Timer();
		this.lifeTimer.set(this.life);
	},
	
	reset: function( x, y, settings ) {
		// This function is called when an instance of this class is resurrected
		// from the entity pool. (Pooling is enabled at the bottom of this file).
		this.parent( x, y, settings );
		
		this.vel.x = 0;
		this.vel.y = this.velocity;
		
		this.lifeTimer.set(this.life);
	},

	update: function() {
		this.parent();
		
		if (this.lifeTimer.delta() >= 0) {
			this.kill();
		}
		
		if (Math.abs(this.vel.y) <= 1) {
			this.kill();
		}
	}
});


});
