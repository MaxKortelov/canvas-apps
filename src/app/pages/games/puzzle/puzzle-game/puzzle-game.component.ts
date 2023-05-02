import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../state/app.state';
import { GAME_STATUS, initialSize, ISize } from '../../../../models/Puzzle';
import { Piece } from '../../../../services/element.service';
import { combineLatest, EMPTY } from 'rxjs';
import * as fromPuzzleGame from '../state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, tap } from 'rxjs/operators';
import { initializer } from '../../../../services/media.service';
import * as fromPuzzleGameActions from '../state/puzzle.actions';

@UntilDestroy()
@Component({
  selector: 'app-puzzle-game',
  templateUrl: './puzzle-game.component.html',
  styleUrls: ['./puzzle-game.component.scss']
})
export class PuzzleGameComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement> | null = null;
  @ViewChild('parentDiv', { static: false }) parentDiv: ElementRef<HTMLDivElement> | null = null;

  constructor(private store: Store<State>) {}

  SCALER: number = 0;
  SIZE: ISize = initialSize();
  PIECES: Piece[] = [];
  SELECTED_PIECE: Piece = null;

  isLoading = true;
  gameStatus: GAME_STATUS = GAME_STATUS.INITIAL;

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
  }

  ngAfterViewInit() {
    initializer(this.parentDiv.nativeElement)
      .pipe(
        tap(() => (this.isLoading = false)),
        tap((video) => {
          video.onloadeddata = () => {
            this.setSizes(video.width, video.height);
            this.parentDiv.nativeElement.addEventListener('resize', () => this.setSizes(video.width, video.height));
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

  startGame(): void {
    switch (this.gameStatus) {
      case GAME_STATUS.INITIAL: {
        this.randomizePieceLocation();
        break;
      }
      default: {
        break;
      }
    }
  }

  get isInitialGame(): boolean {
    return this.gameStatus === GAME_STATUS.INITIAL;
  }

  private updateCanvas(canvas: HTMLCanvasElement, video: HTMLVideoElement): void {
    canvas.width = this.parentDiv.nativeElement.offsetWidth;
    canvas.height = this.parentDiv.nativeElement.offsetHeight;
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
    const resizer =
      this.SCALER *
      Math.min(
        this.parentDiv.nativeElement.offsetWidth / videoWidth,
        this.parentDiv.nativeElement.offsetHeight / videoHeight
      );

    const width = resizer * videoWidth;
    const height = resizer * videoHeight;
    const x = this.parentDiv.nativeElement.offsetWidth / 2 - width / 2;
    const y = this.parentDiv.nativeElement.offsetHeight / 2 - height / 2;

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
    this.gameStatus = GAME_STATUS.PLAY;
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
        x: event.offsetX - this.SELECTED_PIECE.x,
        y: event.offsetY - this.SELECTED_PIECE.y
      };
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.SELECTED_PIECE) {
      this.SELECTED_PIECE.x = event.offsetX - this.SELECTED_PIECE.offset.x;
      this.SELECTED_PIECE.y = event.offsetY - this.SELECTED_PIECE.offset.y;
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
      const isOnPieceWidth =
        location.offsetX > this.PIECES[i].x && location.offsetX < this.PIECES[i].x + this.PIECES[i].width;
      const isOnPieceHeight =
        location.offsetY > this.PIECES[i].y && location.offsetY < this.PIECES[i].y + this.PIECES[i].height;
      if (isOnPieceWidth && isOnPieceHeight) {
        return this.PIECES[i];
      }
    }
    return null;
  }
}
