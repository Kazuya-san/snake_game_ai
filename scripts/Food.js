class Food {
  constructor(size, color) {
    this.x = 0;
    this.y = 0;
    this.size = size;
    this.color = color;
    this.randomFoodPos();
  }

  randomFoodPos(tail) {
    if (!tail || tail.length === 0) {
      let gridRow = floor(random(floor(height / this.size)));
      let gridCol = floor(random(floor(width / this.size)));
      this.x = gridCol * this.size;
      this.y = gridRow * this.size;
    } else {
      let allPositions = [];

      //save all positions to localstorage
      if (localStorage.getItem("allPosition") === null) {
        let cols = floor(width / this.size);
        let rows = floor(height / this.size);
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            allPositions.push({ x: i * this.size, y: j * this.size });
          }
        }
        localStorage.setItem("allPosition", JSON.stringify(allPositions));
      } else {
        allPositions = JSON.parse(localStorage.getItem("allPosition"));
      }

      let possiblePos = random(
        allPositions.filter(
          (pos) =>
            !tail.some((tailPos) => pos.x == tailPos.x && pos.y == tailPos.y)
        )
      );

      this.x = possiblePos.x;
      this.y = possiblePos.y;
    }
  }

  draw() {
    noStroke();
    fill(this.color);
    rect(this.x, this.y, this.size, this.size);
  }
}
