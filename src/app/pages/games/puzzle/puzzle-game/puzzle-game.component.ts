import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../state/app.state';
import { initialSize, ISize } from '../../../../models/Puzzle';
import { Piece } from '../../../../services/element.service';
import { combineLatest, EMPTY } from 'rxjs';
import * as fromPuzzleGame from '../state';
import { untilDestroyed } from '@ngneat/until-destroy';
import { catchError, tap } from 'rxjs/operators';
import { initializer } from '../../../../services/media.service';
import * as fromPuzzleGameActions from '../state/puzzle.actions';

@Component({
  selector: 'app-puzzle-game',
  templateUrl: './puzzle-game.component.html',
  styleUrls: ['./puzzle-game.component.scss']
})
export class PuzzleGameComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement> | null = null;

  constructor(private store: Store<State>) {}

  SCALER: number = 0;
  SIZE: ISize = initialSize();
  PIECES: Piece[] = [];
  SELECTED_PIECE: Piece = null;

  ngOnInit(): void {
    combineLatest([this.store.select(fromPuzzleGame.SCALER), this.store.select(fromPuzzleGame.SIZE)])
      .pipe(
        untilDestroyed(this),
        tap(([SCALER, SIZE]) => {
          this.SCALER = SCALER;
          this.SIZE = SIZE;
        })
      )
      .subscribe();

    initializer()
      .pipe(
        tap((video) => {
          video.onloadeddata = () => {
            this.setSizes(video.width, video.height);
            window.addEventListener('resize', () => this.setSizes(video.width, video.height));
            this.canvas.nativeElement && this.updateCanvas(this.canvas.nativeElement, video);

            // divide canvas image into a pieces
            this.initializePieces();
            // this.randomizePieceLocation();
            this.addCanvasListeners();
          };
        }),
        catchError((err) => {
          console.error('Access to camera is not allowed', err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private updateCanvas(canvas: HTMLCanvasElement, video: HTMLVideoElement): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = this.canvas.nativeElement.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.globalAlpha = 0.5;
    context.drawImage(video, this.SIZE.x, this.SIZE.y, this.SIZE.width, this.SIZE.height);
    context.globalAlpha = 1;

    for (let i = 0; i < this.PIECES.length; i++) {
      context && this.PIECES[i].draw(context, video);
    }

    window.requestAnimationFrame(() => this.updateCanvas(canvas, video));
  }

  private setSizes(videoWidth: number, videoHeight: number): void {
    const resizer = this.SCALER * Math.min(window.innerWidth / videoWidth, window.innerHeight / videoHeight);

    const width = resizer * videoWidth;
    const height = resizer * videoHeight;
    const x = window.innerWidth / 2 - width / 2;
    const y = window.innerHeight / 2 - height / 2;

    this.store.dispatch(fromPuzzleGameActions.changeSize({ SIZE: { ...this.SIZE, width, height, x, y } }));
  }

  private initializePieces(): void {
    this.PIECES = [];

    for (let i = 0; i < this.SIZE.rows; i++) {
      for (let j = 0; j < this.SIZE.columns; j++) {
        this.PIECES.push(new Piece(i, j, this.SIZE));
      }
    }
  }

  private randomizePieceLocation(): void {
    this.PIECES.forEach((piece, i) => {
      let location = {
        x: Math.random() * this.canvas.nativeElement.width - piece.width,
        y: Math.random() * this.canvas.nativeElement.height - piece.height
      };
      this.PIECES[i].x = Math.abs(location.x);
      this.PIECES[i].y = Math.abs(location.y);
    });
  }

  private addCanvasListeners(): void {
    // desktop event listeners
    this.canvas.nativeElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.nativeElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.nativeElement.addEventListener('mouseup', this.handleMouseUp.bind(this));
    // mobile event listeners
    this.canvas.nativeElement.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.nativeElement.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.nativeElement.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  private handleTouchStart(event: TouchEvent): void {
    const location = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
    this.handleMouseDown(location as MouseEvent);
  }

  private handleTouchMove(event: TouchEvent): void {
    const location = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
    this.handleMouseMove(location as MouseEvent);
  }

  private handleTouchEnd(): void {
    this.handleMouseUp();
  }

  private handleMouseDown(event: MouseEvent): void {
    this.SELECTED_PIECE = this.getPressedPiece(event);
    if (this.SELECTED_PIECE) {
      const index = this.PIECES.indexOf(this.SELECTED_PIECE);
      if (index > -1) {
        this.PIECES.slice(index, 1);
        this.PIECES.push(this.SELECTED_PIECE);
      }
      this.SELECTED_PIECE.offset = {
        x: event.x - this.SELECTED_PIECE.x,
        y: event.y - this.SELECTED_PIECE.y
      };
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.SELECTED_PIECE) {
      this.SELECTED_PIECE.x = event.x - this.SELECTED_PIECE.offset.x;
      this.SELECTED_PIECE.y = event.y - this.SELECTED_PIECE.offset.y;
    }
  }

  private handleMouseUp(): void {
    if (this.SELECTED_PIECE && this.SELECTED_PIECE.isClose()) {
      this.SELECTED_PIECE.snap();
    }
    this.SELECTED_PIECE = null;
  }

  private getPressedPiece(location: MouseEvent): Piece {
    for (let i = this.PIECES.length - 1; i >= 0; i--) {
      const isOnPieceWidth = location.x > this.PIECES[i].x && location.x < this.PIECES[i].x + this.PIECES[i].width;
      const isOnPieceHeight = location.y > this.PIECES[i].y && location.y < this.PIECES[i].y + this.PIECES[i].height;
      if (isOnPieceWidth && isOnPieceHeight) {
        return this.PIECES[i];
      }
    }
    return null;
  }
}
