import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function initializer(): Observable<HTMLVideoElement> {
  // Access video
  return from(navigator.mediaDevices.getUserMedia({ audio: false, video: true })).pipe(
    map((stream) => {
      // Adding stream to video
      const video = document.createElement('video');
      video.width = Math.min(window.innerWidth, window.innerHeight * 1.3);
      video.height = window.innerHeight;
      video.srcObject = stream;
      video.play();
      return video;
    })
  );
}
