import { EMPTY, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function initializer(parentDiv: HTMLDivElement): Observable<HTMLVideoElement> {
  // Access video
  return from(navigator.mediaDevices.getUserMedia({ audio: false, video: true })).pipe(
    map((stream) => {
      // Adding stream to video
      const video = document.createElement('video');
      video.width = parentDiv.offsetWidth;
      video.height = parentDiv.offsetHeight;
      video.srcObject = stream;
      video.play();
      return video;
    })
  );
}
