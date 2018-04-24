function Branch (begin, end) {
    // Declare variables
    this.begin = begin;
    this.end = end;
    this.finish = false
    this.len = 0.68;
    this.angle = PI/6;

    // Show the branches
    this.show = function () {
        stroke(88,71,57);
        line(this.begin.x, this.begin.y, this.end.x, this.end.y);
    }

//---------------------------------------
    // Create the left and right branches
    this.branchR = function () {
        // Create a direction vector that points
        // from the botton to the top of a branch
        var dir = p5.Vector.sub(this.end, this.begin);
        // Rotate that branch and shrink it
        dir.rotate(this.angle);
        dir.mult(this.len);
        // Create a new end point by adding the end point with the direction vector
        var newEnd = p5.Vector.add(this.end, dir);

        // Create the new branch on the right
        // using the last point in the last branch
        var r = new Branch(this.end, newEnd);
        return r;
    }

//---------------------------------------
    this.branchL = function () {
        // Create a direction vector that points
        // from the botton to the top of a branch
        var dir = p5.Vector.sub(this.end, this.begin);
        // Rotate that branch and shrink it
        dir.rotate(-this.angle);
        dir.mult(this.len);
        // Create a new end point by adding the end point with the direction vector
        var newEnd = p5.Vector.add(this.end, dir);

        // Create the new branch on the right
        // using the last point in the last branch
        var l = new Branch(this.end, newEnd);
        return l;
    }


}
