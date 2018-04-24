/*
---------------------------------------
This project is created using Daniel Shiffman's "The Coding Train Challenge",
Fractal Tree, Firewoks and Sketch as Background

Links:
    https://youtu.be/0jjeOYMjmDU
    https://youtu.be/fcdNSZ9IzJM
    https://www.youtube.com/watch?v=CKeyIbT3vXI&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH&index=30
    https://www.youtube.com/watch?v=OIfEHD3KqCg
---------------------------------------
*/
var canvas;
var tree = [];
var count = 0;
var flowers = [];
var leaves = [];
var fireworks = [];
var gravity;

//---------------------------------------
function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');

    background(0);
    // Add a colour mode
    colorMode(HSB);
    gravity = createVector(0, 0.2);

    // Create the points of the trunk
    var a = createVector(width/2, height);
    var b = createVector(width/2, height - 100);
    var trunk = new Branch(a, b);
    // First object in the array is the trunk
    tree[0] = trunk;
}

//---------------------------------------
function mousePressed() {
    colorMode(RGB);
    // Go backwards through the array and add at the end
    for (var i = tree.length-1; i >= 0; i--) {

        if (!tree[i].finish) {
            // New branch on the right is created
            tree.push(tree[i].branchR());
            // New branch on the left is created
            tree.push(tree[i].branchL());
        }
        tree[i].finish = true;
    }
    count++;

    // If there are 3/4/7 branches add flowers at the end
    if (count === 3 || count === 4 || count === 7) {
        for (var i = 0; i < tree.length; i++) {
            if (!tree[i].finish) {
                // copy the end point of the branch and add the flowers
                var flower = tree[i].end.copy();
                flowers.push(flower);
            }
        }
    }

    // If there are 2/5 branches add leaves at the end
    if (count === 2 || count === 5) {
        for (var i = 0; i < tree.length; i++) {
            if (!tree[i].finish) {
                // copy the end point of the branch and add the leaves
                var leaf = tree[i].end.copy();
                leaves.push(leaf);
            }
        }
    }
}

//---------------------------------------
function draw() {
    colorMode(RGB);
    background(0, 24);

    // Add the branches using a loop
    for (var i = 0; i < tree.length; i++) {
        tree[i].show();
    }


    // Add the flowers using a loop
    for (var i = 0; i < flowers.length; i++) {
        stroke(135,39,58);
        strokeWeight(0.3);
        fill(226, 65, 97, 150);
        ellipse(flowers[i].x, flowers[i].y, 5, 5);

        // Make the flowers fall
        // if(count >= 10){
        //     flowers[i].y += random(0, 3);
        // }
    }

    // Add the leaves using a loop
    for (var i = 0; i < leaves.length; i++) {
        noStroke();
        fill(79, 171, 91);
        ellipse(leaves[i].x, leaves[i].y, 7, 7);

        // Make the leaves fall
        // if(count >= 9){
        //     leaves[i].y += random(0, 3);
        // }
    }

    // Make a random firework less often
    // There is a 10% chance of making a new firework every frame
    if(random(1) < 0.03) {
        fireworks.push(new Firework());
    }

    for (var i = fireworks.length-1; i >= 0 ; i--) {
        fireworks[i].update();
        fireworks[i].show();

        // Delete the fireworks once they are done
        if (fireworks[i].done()) {
            fireworks.splice(i, 1);
        }
    }

}
