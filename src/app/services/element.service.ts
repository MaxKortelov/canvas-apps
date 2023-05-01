import { ISize } from '../models/Puzzle';
import { State } from '../state/app.state';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import * as fromPuzzleGame from '../state/index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
export class Piece {
  SIZE: ISize;
  rowIndex: number;
  columnIndex: number;
  public x: number;
  public y: number;
  width: number;
  height: number;
  offset: { x: number; y: number };

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
    return true;
  }

  snap(): void {}
}
