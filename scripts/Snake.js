class Snake {
  constructor(x, y, size, color, dir, ai, drawSP) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.direction = dir;
    this.speed = this.size;
    this.tail = [];
    this.dead = false;
    this.score = 0;
    this.angle = 0;
    this.drawSP = drawSP;
    //this.distance = 0;
    this.AI = ai;
    this.shortestPathtoFood = [];
    //this.brain = new NeuralNetwork(5, 8, 8, 2);
  }

  reset(ai, drawSP) {
    this.x = floor(width / 2);
    this.y = floor(height / 2);
    this.direction = random(dir);
    this.speed = this.size;
    this.tail = [];
    this.dead = false;
    this.AI = ai;
    this.score = 0;
    this.drawSP = drawSP;
  }

  useAI() {
    this.AI = !this.AI;
  }

  // calcDistance(food) {
  //   this.distance = dist(this.x, this.y, food.x, food.y);
  // }

  showScore() {
    textSize(20);
    noStroke();
    fill("red");
    text("Score: " + this.score, 10, 20);
  }

  withinBounds() {
    if (this.x + this.size > width) {
      this.direction = "l";
      this.dead = true;
    } else if (this.x < 0) {
      this.direction = "r";
      this.dead = true;
    } else if (this.y + this.size > height) {
      this.direction = "u";
      this.dead = true;
    } else if (this.y < 0) {
      this.direction = "d";
      this.dead = true;
    }
  }

  handleKeys() {
    if (keyIsDown(LEFT_ARROW)) {
      this.direction = "l";
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.direction = "r";
    } else if (keyIsDown(UP_ARROW)) {
      this.direction = "u";
    } else if (keyIsDown(DOWN_ARROW)) {
      this.direction = "d";
    }
  }

  BreadthFirstSearch(food) {
    strokeWeight(2);
    noFill();

    stroke("white");

    let queue = [];
    let visited = [];
    let shortestPath = [];
    let current = { x: this.x, y: this.y, prev: null };
    queue.push(current);
    visited.push(current);

    while (queue.length > 0) {
      current = queue.shift();
      if (current.x === food.x && current.y === food.y) {
        shortestPath.unshift(current);
        let temp = current.prev;
        while (temp != null) {
          shortestPath.unshift(temp);
          temp = temp.prev;
        }
        //console.log("done");
        this.shortestPathtoFood = shortestPath;
        if (this.drawSP) {
          beginShape();
          stroke("white");
          for (let i = 0; i < shortestPath.length; i++) {
            vertex(
              shortestPath[i].x + this.size / 2,
              shortestPath[i].y + this.size / 2
            );
          }
          endShape();
        }
        return shortestPath;
      }
      let neighbors = this.getNeighbors(current);

      neighbors.forEach((neighbor) => {
        let visitedN = visited.find(
          (v) => v.x === neighbor.x && v.y === neighbor.y
        );

        let notBody = this.tail.some(
          (tail) => neighbor.x === tail.x && neighbor.y === tail.y
        );

        if (visitedN === undefined && !notBody) {
          neighbor.prev = current;
          queue.push(neighbor);
          visited.push(neighbor);
        }
      });
    }

    //frameRate(0);
    return 0;
  }

  getNeighbors(current) {
    let neighbors = [];
    let x = current.x;
    let y = current.y;

    if (x + this.size < width) {
      neighbors.push({
        x: x + this.size,
        y: y,
        prev: null,
      });
    }
    if (x - this.size >= 0) {
      neighbors.push({
        x: x - this.size,
        y: y,
        prev: null,
      });
    }
    if (y + this.size < height) {
      neighbors.push({
        x: x,
        y: y + this.size,
        prev: null,
      });
    }
    if (y - this.size >= 0) {
      neighbors.push({
        x: x,
        y: y - this.size,
        prev: null,
      });
    }

    return neighbors;
  }

  detectCollisionWithBoundaries() {
    if (this.x + this.size > width - 30) {
      return -1000;
    } else if (this.x < 30) {
      return -1000;
    } else if (this.y + this.size > height - 30) {
      return -1000;
    } else if (this.y < 30) {
      return -1000;
    } else {
      return 10000000;
    }
  }

  eat(food) {
    let distance = dist(this.x, this.y, food.x, food.y);
    if (distance < 1) {
      this.score++;
      food.randomFoodPos(this.tail);
      this.tail.push(createVector(this.x, this.y));
      return true;
    }

    return false;
  }

  tailChecking() {
    if (this.tail.length > 1) {
      for (let i = 0; i < this.tail.length - 2; i++) {
        if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
          this.dead = true;
          return true;
        }
      }
      //return this.tail.some((tail, i) => this.x === tail.x && this.y === tail.y);
    }
  }

  angleBetweenSnakeAndFood(food) {
    let angle = atan2(food.y - this.y, food.x - this.x);
    return angle;
  }

  move() {
    this.handleKeys();
    this.withinBounds();

    if (!this.AI) {
      if (this.direction === "r") {
        this.x += this.speed;
      } else if (this.direction === "l") {
        this.x -= this.speed;
      } else if (this.direction === "u") {
        this.y -= this.speed;
      } else if (this.direction === "d") {
        this.y += this.speed;
      }
    }

    if (this.tailChecking()) {
      console.log("dead");
      this.dead = true;
    }

    if (this.dead) {
      this.score = 0;
      this.tail = [];
    }

    this.tail.push(createVector(this.x, this.y));
    if (this.tail.length > 1) {
      this.tail.shift();
    }
  }

  draw() {
    fill("white");
    stroke("white");
    strokeWeight(0.3);
    rect(this.x, this.y, this.size, this.size);
    fill(this.color);
    //stroke("white");
    for (let i = this.AI ? 1 : 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, this.size, this.size);
    }
  }
}
