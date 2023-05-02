export interface ICoordinates {
  x: number;
  y: number;
}

export function distance(p1: ICoordinates, p2: ICoordinates): number {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}
