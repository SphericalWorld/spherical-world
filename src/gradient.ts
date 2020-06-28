class Gradient {
  points: number[][];

  constructor(points: number[][]) {
    this.points = [];
    for (let i = 0; i < points.length; i += 1) {
      this.points.push([
        points[i][0],
        (points[i][1] & 0xff0000) >> 16,
        (points[i][1] & 0xff00) >> 8,
        points[i][1] & 0xff,
      ]);
    }
  }

  getAtPosition(pos: number): number {
    for (let i = 1; i < this.points.length; i += 1) {
      if (this.points[i][0] > pos) {
        const posStart = pos - this.points[i - 1][0];
        const deltaPos = this.points[i][0] - this.points[i - 1][0];
        const deltaColor = [
          this.points[i][1] - this.points[i - 1][1],
          this.points[i][2] - this.points[i - 1][2],
          this.points[i][3] - this.points[i - 1][3],
        ];
        return (
          0 |
          ((this.points[i - 1][1] + (posStart * deltaColor[0]) / deltaPos) << 16) |
          ((this.points[i - 1][2] + (posStart * deltaColor[1]) / deltaPos) << 8) |
          (this.points[i - 1][3] + (posStart * deltaColor[2]) / deltaPos)
        );
      }
    }
    return this.points[this.points.length - 1][0];
  }
}

export default Gradient;
