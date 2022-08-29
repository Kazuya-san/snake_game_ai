let snake;
let food;
let pauseGame = false;
let snakeScale = 30; //let dir = ["l", "r", "u", "d"];
let dir = ["u", "d", "l", "r"];
let totalCols;
let totalRows;
let shortestPath;
let indexOfShortest = 0;
let ai = true;
let fps = 20;
let drawSP = true;
let fpsChange = false;
let useBody = true;

function setup() {
  createCanvas(innerWidth, innerHeight);
  frameRate(fps);
  localStorage.removeItem("allPosition");

  totalCols = floor(width / snakeScale);
  totalRows = floor(height / snakeScale);
  snake = new Snake(
    floor(totalCols / 2) * snakeScale,
    floor(totalRows / 2) * snakeScale,
    snakeScale,
    "red",
    random(dir),
    ai,
    drawSP,
    useBody
  );
  food = new Food(snakeScale, "green");
  shortestPath = snake.BreadthFirstSearch(food);
}

function Spot(x, y) {
  this.x = x;
  this.y = y;
  this.prev = null;
  this.t = null;
}

function draw() {
  background(51);
  stroke(100);
  strokeWeight(0.3);
  for (let x = 1; x <= totalRows; x++) {
    line(0, x * snakeScale, width, x * snakeScale);
  }

  for (let y = 1; y <= totalCols; y++) {
    line(y * snakeScale, 0, y * snakeScale, height);
  }

  if (!snake.AI) {
    shortestPath = snake.BreadthFirstSearch(food);
  }

  if (indexOfShortest < shortestPath.length) {
    indexOfShortest++;
  } else if (indexOfShortest >= shortestPath.length) {
    indexOfShortest = 0;
  }

  let index = indexOfShortest > 0 ? indexOfShortest - 1 : 0;

  if (shortestPath[index] && snake.AI) {
    snake.x = shortestPath[index].x;
    snake.y = shortestPath[index].y;
  } else {
    shortestPath = snake.BreadthFirstSearch(food);
    indexOfShortest = 0;
  }

  food.draw();
  snake.draw();
  snake.move();
  snake.showScore();

  if (snake.dead) {
    console.log("dead");
    noLoop();
    alert("Game Over, press R to restart");
  }

  if (snake.eat(food)) {
    shortestPath = snake.BreadthFirstSearch(food);
    indexOfShortest = 0;
  }
}

function keyPressed() {
  if (keyCode === 32 && !pauseGame) {
    pauseGame = true;
    frameRate(0);
  } else if (keyCode === 32 && pauseGame) {
    pauseGame = false;
    frameRate(fps);
  } else if (keyCode === 65) {
    ai = !ai;
    snake.useAI();
  } else if (key === "r") {
    snake.reset(ai, drawSP, useBody);
    food.randomFoodPos();
    shortestPath = snake.BreadthFirstSearch(food);
    indexOfShortest = 0;
    loop();
  } else if (key == "f") {
    fpsChange = !fpsChange;
    if (fpsChange) {
      frameRate(100);
    } else {
      frameRate(fps);
    }
  } else if (key == "b") {
    useBody = !useBody;
    snake.useTail(useBody);
  }
}
