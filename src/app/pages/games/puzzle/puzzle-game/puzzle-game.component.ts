import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../state/app.state';
import { GAME_STATUS, initialSize, IResult, ISize } from '../../../../models/Puzzle';
import { Piece } from '../../../../services/element.service';
import { combineLatest, EMPTY } from 'rxjs';
import * as fromPuzzleGame from '../state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, tap } from 'rxjs/operators';
import { initializer } from '../../../../services/media.service';
import * as fromPuzzleGameActions from '../state/puzzle.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../../services/local-storage.service';
import * as fromAppState from '../../../../state';
import { createRGBAColor, createRGBColor, getRandomColor } from '../../../../services/color.service';

@UntilDestroy()
@Component({
  selector: 'app-puzzle-game',
  templateUrl: './puzzle-game.component.html',
  styleUrls: ['./puzzle-game.component.scss']
})
export class PuzzleGameComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement> | null = null;

  constructor(
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {}

  SCALER: number = 0;
  SIZE: ISize = initialSize();
  name: string = '';
  PIECES: Piece[] = [];
  SELECTED_PIECE: Piece = null;

  HELPER_CANVAS = document.createElement('canvas');
  HELPER_CANVAS_CONTEXT = this.HELPER_CANVAS.getContext('2d');
  CONTEXT: CanvasRenderingContext2D;

  PLAYED_TIME: number = 0;
  START_TIME: number = 0;
  TIME: number = 0;

  isLoading = true;
  gameStatus: GAME_STATUS = GAME_STATUS.INITIAL;

  ngOnInit(): void {
    this.saveDataToLocalStorage();

    combineLatest([
      this.store.select(fromPuzzleGame.SCALER),
      this.store.select(fromPuzzleGame.SIZE),
      this.store.select(fromPuzzleGame.name)
    ])
      .pipe(
        untilDestroyed(this),
        tap(([SCALER, SIZE, name]) => {
          this.SCALER = SCALER;
          this.SIZE = SIZE;
          this.name = name;
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    initializer()
      .pipe(
        tap((video) => {
          video.onloadeddata = () => {
            this.setSizes(video.width, video.height);
            window.addEventListener('resize', () => {
              this.setSizes(video.width, video.height);
            });
            this.canvas.nativeElement && this.updateGame(this.canvas.nativeElement, video);

            // divide canvas image into a pieces
            this.initializePieces();
            this.addCanvasListeners();
          };
        }),
        tap(() => (this.isLoading = false)),
        catchError((err) => {
          console.error('Access to camera is not allowed', err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  updateGameStatus(): void {
    switch (this.gameStatus) {
      case GAME_STATUS.INITIAL: {
        this.randomizePieceLocation();
        this.START_TIME = new Date().getTime();
        break;
      }
      case GAME_STATUS.PLAY: {
        this.gameStatus = GAME_STATUS.PAUSE;
        this.PLAYED_TIME += this.TIME;
        break;
      }
      case GAME_STATUS.PAUSE: {
        this.gameStatus = GAME_STATUS.PLAY;
        this.START_TIME = new Date().getTime();
        break;
      }
      default: {
        break;
      }
    }
  }

  get isPausedGame(): boolean {
    return this.gameStatus === GAME_STATUS.INITIAL || this.gameStatus === GAME_STATUS.PAUSE;
  }

  private updateTime(): void {
    this.TIME = new Date().getTime() - this.START_TIME;
  }

  private updateGame(canvas: HTMLCanvasElement, video: HTMLVideoElement): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.HELPER_CANVAS.width = window.innerWidth;
    this.HELPER_CANVAS.height = window.innerHeight;

    const context = this.canvas.nativeElement.getContext('2d');

    this.CONTEXT = context;

    context.clearRect(0, 0, canvas.width, canvas.height);
    this.HELPER_CANVAS_CONTEXT.clearRect(0, 0, this.HELPER_CANVAS.width, this.HELPER_CANVAS.height);

    context.globalAlpha = 0.5;
    context.drawImage(video, this.SIZE.x, this.SIZE.y, this.SIZE.width, this.SIZE.height);
    context.globalAlpha = 1;

    this.gameStatus === GAME_STATUS.PLAY && this.updateTime();

    for (let i = 0; i < this.PIECES.length; i++) {
      context && this.PIECES[i] && this.PIECES[i].draw(context, video);
      context && this.PIECES[i] && this.PIECES[i].draw(this.HELPER_CANVAS_CONTEXT, video, false);
    }

    window.requestAnimationFrame(() => this.updateGame(canvas, video));
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
    const uniqueRandomColors: string[] = [];

    for (let i = 0; i < this.SIZE.rows; i++) {
      for (let j = 0; j < this.SIZE.columns; j++) {
        let color = getRandomColor();
        while (uniqueRandomColors.includes(color)) {
          color = getRandomColor();
        }
        uniqueRandomColors.push(color);
        this.PIECES.push(new Piece(i, j, this.SIZE, color));
      }
    }

    // TODO - change with i;
    let cnt = 0;
    for (let i = 0; i < this.SIZE.rows; i++) {
      for (let j = 0; j < this.SIZE.columns; j++) {
        const piece = this.PIECES[cnt];
        if (i !== this.SIZE.rows - 1) {
          const sgn = Math.random() - 0.5 < 0 ? -1 : 1;
          piece.bottom = sgn * Math.random() * 0.1 + 0.3;
        }
        if (j !== this.SIZE.columns - 1) {
          const sgn = Math.random() - 0.5 < 0 ? -1 : 1;
          piece.right = sgn * Math.random() * 0.1 + 0.3;
        }
        if (j !== 0) {
          piece.left = -this.PIECES[cnt - 1].right;
        }
        if (i !== 0) {
          piece.top = -this.PIECES[cnt - this.SIZE.columns].bottom;
        }
        cnt++;
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
    const imgData = this.HELPER_CANVAS_CONTEXT.getImageData(event.x, event.y, 1, 1);
    if (imgData.data[3] === 0) {
      return;
    }

    this.gameStatus = GAME_STATUS.PLAY;
    const clickedColor = createRGBColor(imgData.data[0], imgData.data[1], imgData.data[2], 0);
    this.SELECTED_PIECE = this.getPressedPieceByColor(clickedColor);
    // this.SELECTED_PIECE = this.getPressedPiece(event);
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
    if (this.checkCorrectLocations) {
      this.gameStatus = GAME_STATUS.FINISHED;
      this.PLAYED_TIME += this.TIME;
      const result: IResult = {
        name: this.name,
        time: this.PLAYED_TIME,
        isLastResult: true,
        difficulty: this.SIZE.rows
      };
      this.store.dispatch(fromPuzzleGameActions.updateResult({ result }));
      this.saveDataToLocalStorage();
      this.router.navigate(['../result'], { relativeTo: this.route });
    }
  }

  // private getPressedPiece(location: MouseEvent): Piece {
  //   for (let i = this.PIECES.length - 1; i >= 0; i--) {
  //     const isOnPieceWidth =
  //       location.offsetX > this.PIECES[i].x && location.offsetX < this.PIECES[i].x + this.PIECES[i].width;
  //     const isOnPieceHeight =
  //       location.offsetY > this.PIECES[i].y && location.offsetY < this.PIECES[i].y + this.PIECES[i].height;
  //     if (isOnPieceWidth && isOnPieceHeight) {
  //       return this.PIECES[i];
  //     }
  //   }
  //   return null;
  // }

  private getPressedPieceByColor(clickedColor: string): Piece {
    for (let i = this.PIECES.length - 1; i >= 0; i--) {
      if (this.PIECES[i].color === clickedColor) {
        return this.PIECES[i];
      }
    }
    return null;
  }

  get checkCorrectLocations(): boolean {
    return this.PIECES.filter((piece) => piece.x !== piece.xCorrect && piece.y !== piece.yCorrect).length === 0;
  }

  saveDataToLocalStorage(): void {
    this.store
      .select(fromAppState.STATE)
      .pipe(
        untilDestroyed(this),
        tap((localData) => {
          this.localStorageService.syncSaveData(localData);
        })
      )
      .subscribe();
  }
}
