export interface ISize {
  x: number;
  y: number;
  width: number;
  height: number;
  rows: LEVEL;
  columns: LEVEL;
}

export function initialSize(): ISize {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rows: LEVEL.BEGINNER,
    columns: LEVEL.BEGINNER
  };
}

export interface IResult {
  name: string;
  time: number;
  isLastResult: boolean;
  difficulty: LEVEL;
}

export enum LEVEL {
  BEGINNER = 3,
  AMATOUR = 8,
  HARD = 12,
  EXTREMELY_HARD = 18,
  INSANE = 24
}

export enum GAME_STATUS {
  INITIAL,
  PAUSE,
  PLAY,
  FINISHED
}
