function Firework() {

    this.hu = random(255);
    // Add the particles to the firework
    this.firework = new Particle(random(width), height, this.hu, true);
    this.explode = false;
    this.particles = [];

//-------------------------------------------------------
    // Create new particles where the firework explodes
    this.exploded = function() {
        for(var i = 0; i < 100; i++) {
            var p = new Particle(this.firework.location.x, this.firework.location.y, this.hu, false);
            this.particles.push(p);
        }
    }

//-------------------------------------------------------
    // Call the particle functions update and applyForce
    this.update = function() {
        // Only apply functions if the firework exists
        if (!this.explode) {
            this.firework.applyForce(gravity);
            this.firework.update();
            // If the y velocity is 0 or positive (falling)
            // then explode the firework
            if (this.firework.velocity.y >= 0) {
                this.explode = true;
                this.exploded();
            }
        }

        // For all the exploded particles apply gravity and update
        for (var i = this.particles.length-1; i >= 0; i--) {
            this.particles[i].applyForce(gravity);
            this.particles[i].update();
            // then delete the particle after it's done
            if (this.particles[i].done()) {
                this.particles.splice(i, 1);
            }
        }
    }

//-------------------------------------------------------
    // Call the show function
    this.show = function() {
        // Only show the firework if it exists
        if (!this.explode) {
            this.firework.show();
        }

        // Add the exploding particles to the firework
        // Particles called from the Particle class
        for(var i = 0; i < this.particles.length; i++) {
            this.particles[i].show();
        }
    }

//-------------------------------------------------------
    // If the firework exploded and lifespan is finished
    // then the firework is done
    this.done = function() {
        if (this.explode && this.particles.length === 0) {
            return true;
        } else {
            return false;
        }
    }

//-------------------------------------------------------
    // The applyForce function adds a force to the acceleration.
    this.applyForce = function(force) {
        this.acceleration.add(force);
    }
}
