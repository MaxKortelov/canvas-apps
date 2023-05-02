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

    context.drawImage(
      video,
      (this.columnIndex * video.videoWidth) / this.SIZE.columns,
      (this.rowIndex * video.videoHeight) / this.SIZE.rows,
      video.videoWidth / this.SIZE.columns,
      video.videoHeight / this.SIZE.rows,
      this.x,
      this.y,
      this.width,
      this.height
    );

    context.rect(this.x, this.y, this.width, this.height);
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
