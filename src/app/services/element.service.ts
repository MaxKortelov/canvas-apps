import { ISize } from '../models/Puzzle';
import { UntilDestroy } from '@ngneat/until-destroy';
import { distance } from '../utils/measurment';

@UntilDestroy()
export class Piece {
  SIZE: ISize;
  rowIndex: number;
  columnIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  offset: { x: number; y: number };
  xCorrect: number;
  yCorrect: number;
  top: number = 0;
  bottom: number = 0;
  left: number = 0;
  right: number = 0;

  constructor(rowIndex: number, columnIndex: number, SIZE: ISize) {
    this.rowIndex = rowIndex;
    this.columnIndex = columnIndex;
    this.SIZE = SIZE;

    this.initializePiece(SIZE);
  }

  initializePiece(SIZE: ISize) {
    this.x = SIZE.x + (SIZE.width * this.columnIndex) / SIZE.columns;
    this.y = SIZE.y + (SIZE.height * this.rowIndex) / SIZE.rows;
    this.width = SIZE.width / SIZE.columns;
    this.height = SIZE.height / SIZE.rows;
    this.xCorrect = this.x;
    this.yCorrect = this.y;
  }

  draw(context: CanvasRenderingContext2D, video: HTMLVideoElement): void {
    context.beginPath();

    const sz = Math.min(this.width, this.height);
    const neck = 0.05 * sz;
    const tabWidth = 0.3 * sz;
    const tabHeight = 0.3 * sz;

    // from top left
    context.moveTo(this.x, this.y);
    // to top right
    if (this.top !== 0) {
      context.lineTo(this.x + this.width * Math.abs(this.top) - neck, this.y);
      context.bezierCurveTo(
        this.x + this.width * Math.abs(this.top) - neck,
        this.y - tabHeight * Math.sign(this.top) * 0.2,

        this.x + this.width * Math.abs(this.top) - tabWidth,
        this.y - tabHeight * Math.sign(this.top),

        this.x + this.width * Math.abs(this.top),
        this.y - tabHeight * Math.sign(this.top)
      );

      context.bezierCurveTo(
        this.x + this.width * Math.abs(this.top) + tabWidth,
        this.y - tabHeight * Math.sign(this.top),

        this.x + this.width * Math.abs(this.top) + neck,
        this.y - tabHeight * Math.sign(this.top) * 0.2,

        this.x + this.width * Math.abs(this.top) + neck,
        this.y
      );
    }
    context.lineTo(this.x + this.width, this.y);
    // to bottom right
    if (this.right !== 0) {
      context.lineTo(this.x + this.width, this.y + this.height * Math.abs(this.right) - neck);
      context.bezierCurveTo(
        this.x + this.width - tabWidth * Math.sign(this.right) * 0.2,
        this.y + this.height * Math.abs(this.right) - neck,

        this.x + this.width - tabWidth * Math.sign(this.right),
        this.y + this.height * Math.abs(this.right) - tabWidth,

        this.x + this.width - tabHeight * Math.sign(this.right),
        this.y + this.height * Math.abs(this.right)
      );
      context.bezierCurveTo(
        this.x + this.width - tabWidth * Math.sign(this.right),
        this.y + this.height * Math.abs(this.right) + tabWidth,

        this.x + this.width - tabWidth * Math.sign(this.right) * 0.2,
        this.y + this.height * Math.abs(this.right) + neck,

        this.x + this.width,
        this.y + this.height * Math.abs(this.right) + neck
      );
    }
    context.lineTo(this.x + this.width, this.y + this.height);
    // to bottom left
    if (this.bottom !== 0) {
      context.lineTo(this.x + this.width * Math.abs(this.bottom) + neck, this.y + this.height);

      context.bezierCurveTo(
        this.x + this.width * Math.abs(this.bottom) + neck,
        this.y + this.height + tabHeight * Math.sign(this.bottom) * 0.2,

        this.x + this.width * Math.abs(this.bottom) + tabWidth,
        this.y + this.height + tabHeight * Math.sign(this.bottom),

        this.x + this.width * Math.abs(this.bottom),
        this.y + this.height + tabHeight * Math.sign(this.bottom)
      );
      context.bezierCurveTo(
        this.x + this.width * Math.abs(this.bottom) - tabWidth,
        this.y + this.height + tabHeight * Math.sign(this.bottom),

        this.x + this.width * Math.abs(this.bottom) - neck,
        this.y + this.height + tabHeight * Math.sign(this.bottom) * 0.2,

        this.x + this.width * Math.abs(this.bottom) - neck,
        this.y + this.height
      );
    }
    context.lineTo(this.x, this.y + this.height);
    // to top left
    if (this.left !== 0) {
      context.lineTo(this.x, this.y + this.height * Math.abs(this.left) + neck);

      context.bezierCurveTo(
        this.x + tabHeight * Math.sign(this.left) * 0.2,
        this.y + this.height * Math.abs(this.left) + neck,

        this.x + tabHeight * Math.sign(this.left),
        this.y + this.height * Math.abs(this.left) + tabWidth,

        this.x + tabHeight * Math.sign(this.left),
        this.y + this.height * Math.abs(this.left)
      );

      context.bezierCurveTo(
        this.x + tabHeight * Math.sign(this.left),
        this.y + this.height * Math.abs(this.left) - tabWidth,

        this.x + tabHeight * Math.sign(this.left) * 0.2,
        this.y + this.height * Math.abs(this.left) - neck,

        this.x,
        this.y + this.height * Math.abs(this.left) - neck
      );
    }
    context.lineTo(this.x, this.y);

    context.save();
    context.clip();

    const scaledTabHeight = Math.min(video.videoWidth / this.SIZE.columns, video.videoHeight / this.SIZE.rows) * 0.3;

    context.drawImage(
      video,
      (this.columnIndex * video.videoWidth) / this.SIZE.columns - scaledTabHeight,
      (this.rowIndex * video.videoHeight) / this.SIZE.rows - scaledTabHeight,
      video.videoWidth / this.SIZE.columns + scaledTabHeight * 2,
      video.videoHeight / this.SIZE.rows + scaledTabHeight * 2,
      this.x - tabWidth,
      this.y - tabHeight,
      this.width + tabWidth * 2,
      this.height + tabWidth * 2
    );
    context.restore();

    context.stroke();
  }

  isClose(): boolean {
    const p1 = { x: this.x, y: this.y };
    const p2 = { x: this.xCorrect, y: this.yCorrect };
    if (distance(p1, p2) < this.width / 3) {
      return true;
    }
    return false;
  }

  snap(): void {
    this.x = this.xCorrect;
    this.y = this.yCorrect;
  }
}
