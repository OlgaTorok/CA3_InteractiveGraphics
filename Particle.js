function Particle(x, y, hu, firework) {
    // Declare variables
    this.location = createVector(x, y);
    this.firework = firework;
    this.lifespan = 255;
    this.hu = hu;
    // If firework is true it will move up at random locations
    if(this.firework) {
        this.velocity = createVector(0, random(-18, -7));
    } else {
        // If it's false it will go in any random direction
        // at a random distance
        this.velocity = p5.Vector.random2D();
        this.velocity.mult(random(2, 10));
    }
    this.acceleration = createVector(0, 0);


//-------------------------------------------------------
    this.show = function() {
        //If it's not a firework
        if(!this.firework) {
            colorMode(HSB);
            strokeWeight(1);
            stroke(hu, 255, 255, this.lifespan);
        } else {
            // If it's a firework
            colorMode(HSB);
            strokeWeight(1);
            stroke(hu, 255, 255);
        }
        point(this.location.x, this.location.y);
    }

//-------------------------------------------------------
    this.update = function() {
        // If this is not a firework slow down the expoded particles
        // and minimize the lifespan
        if (!this.firework) {
            this.velocity.mult(0.9);
            this.lifespan -= 4;
        }
        // Add the velocity to acceleration and
        // the location to velocity and reset the acceeleration
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
    }

//-------------------------------------------------------
    // If lifespan is less then 0 then the particle is done
    this.done = function() {
        if (this.lifespan < 0) {
            return true;
        } else {
            return false;
        }
    }

//-------------------------------------------------------
    // Force accumulation
    // Add a force to the acceleration
    this.applyForce = function(force) {
        this.acceleration.add(force);
    }
}
