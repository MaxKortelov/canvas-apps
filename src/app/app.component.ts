import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initializer } from './services/media.service';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Piece } from './services/element.service';
import { ISize } from './models/Puzzle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement> | null = null;
  video: HTMLVideoElement = null;
  SCALER = 0.8;
  SIZE: ISize = { x: 0, y: 0, width: 0, height: 0, rows: 3, columns: 3 };
  PIECES: any[] = [];

  ngOnInit(): void {
    initializer()
      .pipe(
        tap((video) => {
          video.onloadeddata = () => {
            this.video = video;
            this.setSizes(video.width, video.height);
            window.addEventListener('resize', () => this.setSizes(video.width, video.height));
            this.canvas.nativeElement && this.updateCanvas(this.canvas.nativeElement, this.video);

            // divide canvas image into a pieces
            this.initializePieces();
            this.randomizePieceLocation();
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
      context && this.PIECES[i].draw(context, this.video);
    }

    window.requestAnimationFrame(() => this.updateCanvas(canvas, video));
  }

  private setSizes(videoWidth: number, videoHeight: number): void {
    const resizer = this.SCALER * Math.min(window.innerWidth / videoWidth, window.innerHeight / videoHeight);

    this.SIZE.width = resizer * videoWidth;
    this.SIZE.height = resizer * videoHeight;
    this.SIZE.x = window.innerWidth / 2 - this.SIZE.width / 2;
    this.SIZE.y = window.innerHeight / 2 - this.SIZE.height / 2;
  }

  private initializePieces(): void {
    this.PIECES = [];
    for (let i = 0; i < this.SIZE.rows; i++) {
      for (let j = 0; j < this.SIZE.columns; j++) {
        this.PIECES.push(new Piece(i, j, this.SIZE));
      }
    }
    console.log(this.PIECES);
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
}
