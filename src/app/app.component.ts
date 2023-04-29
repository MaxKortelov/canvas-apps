import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initializer } from './services/mediaService';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement> | null = null;
  video: HTMLVideoElement = null;
  SCALER = 0.8;
  SIZE = { x: 0, y: 0, width: 0, height: 0 };

  ngOnInit(): void {
    initializer()
      .pipe(
        tap((video) => {
          video.onloadeddata = () => {
            this.video = video;
            this.setSizes(video.width, video.height);
            this.canvas.nativeElement && this.updateCanvas(this.canvas.nativeElement, this.video);
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
    this.video && context && context.drawImage(video, this.SIZE.x, this.SIZE.y, this.SIZE.width, this.SIZE.height);
    window.requestAnimationFrame(() => this.updateCanvas(canvas, video));
  }

  private setSizes(videoWidth: number, videoHeight: number): void {
    const resizer = this.SCALER * Math.min(window.innerWidth / videoWidth, window.innerHeight / videoHeight);

    this.SIZE.width = resizer * videoWidth;
    this.SIZE.height = resizer * videoHeight;
    this.SIZE.x = window.innerWidth / 2 - this.SIZE.width / 2;
    this.SIZE.y = window.innerHeight / 2 - this.SIZE.height / 2;
  }
}
