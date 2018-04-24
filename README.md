# Fractal Tree and Fireworks

This project is created using Daniel Shiffman's "The Coding Train Challenge" tutorials
- [Fractal Tree](https://youtu.be/0jjeOYMjmDU), [Fractal Tree 2](https://youtu.be/fcdNSZ9IzJM)
- [Fireworks](https://www.youtube.com/watch?v=CKeyIbT3vXI&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH&index=30)
- [Sketch as Background](https://www.youtube.com/watch?v=OIfEHD3KqCg)

---
The project contains a fractal tree that grows with flowers and leaves when the mouse is pressed, and fireworks playing in the background.

## Sketch

First thing in this file is declaring the variables. Some of the variables will be declared as array for the purpose of creating multiple objects.

```js
var canvas;
var tree = [];
var count = 0;
var flowers = [];
var leaves = [];
var fireworks = [];
var gravity;
```

The **setup()** function is called only once. Inside the function the canvas is added to be the size of the window, then it is moved at the back of the HTML using the CSS **z-index** property.

The background, the colour mode to HSB, which allows us to use the Hue/Saturation/Brightness system, and a vector for gravity are set. Next the **Branch** class is called to create the trunk at the position 0 in the array. The trunk will stay the same position and the branches will be built on it at different locations and angles.

```js
function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');

    background(0);
    colorMode(HSB);
    gravity = createVector(0, 0.2);

    var a = createVector(width/2, height);
    var b = createVector(width/2, height - 100);
    var trunk = new Branch(a, b);
    tree[0] = trunk;
}
```
The new function added is **mousePressed()** which creates the branches that will be added when the mouse is pressed. The colour mode is changed to RGB.

A **for** loop is added to go backwards through the array for as long as the tree is not finished. Create the left and right branches by calling the functions from the Branch class and keep track of the mouse clicks using the variable count.

Leaves and flowers are added using **if** statements. If the count gets to a given number and the tree is not finished, make a copy of the last point in the tree at that moment and add the flowers and leaves using the **push** function.

```js

//---------------------------------------
function mousePressed() {
    colorMode(RGB);

    for (var i = tree.length-1; i >= 0; i--) {
        if (!tree[i].finish) {
            tree.push(tree[i].branchR());
            tree.push(tree[i].branchL());
        }
        tree[i].finish = true;
    }
    count++;

    if (count === 3 || count === 4 || count === 7) {
        for (var i = 0; i < tree.length; i++) {
            if (!tree[i].finish) {
                var flower = tree[i].end.copy();
                flowers.push(flower);
            }
        }
    }

    if (count === 2 || count === 5) {
        for (var i = 0; i < tree.length; i++) {
            if (!tree[i].finish) {
                var leaf = tree[i].end.copy();
                leaves.push(leaf);
            }
        }
    }
}
```
The **draw()** function runs until it is told to stop. In this function the colour mode is changed and the background is added to be refreshed every frame. Next, a loop is created to add all the branches by calling the **show()** function from the Branch class. The flowers and the leaves are created here in a **for** loop with the stroke and colour.

```js
function draw() {
    colorMode(RGB);
    background(0, 24);

    for (var i = 0; i < tree.length; i++) {
        tree[i].show();
    }

    for (var i = 0; i < flowers.length; i++) {
        stroke(135,39,58);
        strokeWeight(0.3);
        fill(226, 65, 97, 150);
        ellipse(flowers[i].x, flowers[i].y, 5, 5);
    }

    for (var i = 0; i < leaves.length; i++) {
        noStroke();
        fill(79, 171, 91);
        ellipse(leaves[i].x, leaves[i].y, 7, 7);
    }
```
The fireworks are set using an **if** statement. They are added at random and with a 10% chance of being added each frame. Going backwards through a fireworks **for** loop, the functions update and show are called form the Firework class. If the firework is done then it is removed from the array.

```js
    if(random(1) < 0.03) {
        fireworks.push(new Firework());
    }

    for (var i = fireworks.length-1; i >= 0 ; i--) {
        fireworks[i].update();
        fireworks[i].show();

        if (fireworks[i].done()) {
            fireworks.splice(i, 1);
        }
    }
}
```

## Branch

The Branch object creates the branches that go on top of the tree trunk made in the **setup()** function.

First, variables are declared. Then the **show** function is set where the branch is created using a line with a stroke. Next, two similar functions are added, one function for the branches on the right and one function for the branches on the left. In each function a direction vector is created using the **p5.Vector** method, then it is rotate, and using the **mult()** function the branch is made smaller. Using the p5.Vector method again a vector **newEnd** is created and it adds the new direction vector and the end point. A new branch is added at the end point of the previous branch by calling the Branch class within itself.

```js
function Branch (begin, end) {
    this.begin = begin;
    this.end = end;
    this.finish = false
    this.len = 0.68;
    this.angle = PI/6;

    this.show = function () {
        stroke(88,71,57);
        line(this.begin.x, this.begin.y, this.end.x, this.end.y);
    }

    this.branchR = function () {
        var dir = p5.Vector.sub(this.end, this.begin);
        dir.rotate(this.angle);
        dir.mult(this.len);
        var newEnd = p5.Vector.add(this.end, dir);

        var r = new Branch(this.end, newEnd);
        return r;
    }

    this.branchL = function () {
        var dir = p5.Vector.sub(this.end, this.begin);
        dir.rotate(-this.angle);
        dir.mult(this.len);
        var newEnd = p5.Vector.add(this.end, dir);

        var l = new Branch(this.end, newEnd);
        return l;
    }
}
```

## Particle

The particles in this class are part of the fireworks. The class contains parameters for x and y locations, for the colour and for the firework. At the beginning of the object, the variables are declared. One of the variables created is **firework** which if true it will move at a given velocity in the y direction and if false it will go in a random direction with a random velocity. The particle that moves in the y direction is the firework and the particle moving in random direction is the particle created after the firework has exploded. The location, velocity and acceleration variables are added as vectors.

```js
function Particle(x, y, hu, firework) {
    // Declare variables
    this.location = createVector(x, y);
    this.firework = firework;
    this.lifespan = 255;
    this.hu = hu;

    if(this.firework) {
        this.velocity = createVector(0, random(-18, -7));
    } else {
        this.velocity = p5.Vector.random2D();
        this.velocity.mult(random(2, 10));
    }
    this.acceleration = createVector(0, 0);
```
The **show** function contains the particle and an **if** statement that gives colour, stroke and lifespan to the particle depending on the type, if it's a firework or a particle from explosion.

```js

    this.show = function() {
        if(!this.firework) {
            colorMode(HSB);
            strokeWeight(1);
            stroke(hu, 255, 255, this.lifespan);
        } else {
            colorMode(HSB);
            strokeWeight(1);
            stroke(hu, 255, 255);
        }
        point(this.location.x, this.location.y);
    }
```
The **update** function is set next. If the firework is a particle after explosion slow it down using the **mult()** function and make the lifespan smaller. The acceleration is added to velocity and the velocity to the location, then the acceleration is set back to 0.

```js
    this.update = function() {
        if (!this.firework) {
            this.velocity.mult(0.9);
            this.lifespan -= 4;
        }

        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
    }
```
The function **done** is added to say that if the lifespan is less than 0 then the particle is done. This function is used to get rid of particles once the firework exploded and the particles are done.

The **applyForce** function adds a force to the acceleration. In this case the force acting on the particle is gravity.

```js
    this.done = function() {
        if (this.lifespan < 0) {
            return true;
        } else {
            return false;
        }
    }

    this.applyForce = function(force) {
        this.acceleration.add(force);
    }
}
```

## Fireworks

The start of the **Firework** class contains the declared variables. One of the variable declared is the firework which creates a new particle using the **Particle** class.

The **exploded** function contains a **for** loop that returns 100 particles where the firework exploded.

```js
function Firework() {
    this.hu = random(255);
    this.firework = new Particle(random(width), height, this.hu, true);
    this.explode = false;
    this.particles = [];

    this.exploded = function() {
        for(var i = 0; i < 100; i++) {
            var p = new Particle(this.firework.location.x, this.firework.location.y, this.hu, false);
            this.particles.push(p);
        }
    }
```
The **update** function calls the functions **applyForce**, with gravity as a parameter, and **update** from the Firework class, if the firework exists. If the firework exists and it is stopped or moving in the positive y direction then the firework will explode by calling the function **exploded** from above.

Next, for all the exploded particles apply gravity and update the particles by calling the functions **applyForce**, with gravity as a parameter, and **update** from the Particle class. Next delete the particles from the array if they are done. The function **done** contains an **if** statement. If the firework exploded and lifespan is finished then the firework disappears.

```js
    this.update = function() {
        if (!this.explode) {
            this.firework.applyForce(gravity);
            this.firework.update();

            if (this.firework.velocity.y >= 0) {
                this.explode = true;
                this.exploded();
            }
        }

        for (var i = this.particles.length-1; i >= 0; i--) {
            this.particles[i].applyForce(gravity);
            this.particles[i].update();
            if (this.particles[i].done()) {
                this.particles.splice(i, 1);
            }
        }
    }

    this.done = function() {
        if (this.explode && this.particles.length === 0) {
            return true;
        } else {
            return false;
        }
    }
```
The **show** function is set. If the firework exists then show it, if not add the particles from the Particle class by calling the **show** function from that class.

The **applyForce** function adds a force to the acceleration.

```js
    this.show = function() {
        if (!this.explode) {
            this.firework.show();
        }
        for(var i = 0; i < this.particles.length; i++) {
            this.particles[i].show();
        }
    }

    this.applyForce = function(force) {
        this.acceleration.add(force);
    }
}
```

Result:

![Fractal Tree And Fireworks](img/fire_tree.PNG?raw=true "Fractal Tree & Fireworks")
