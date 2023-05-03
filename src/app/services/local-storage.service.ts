import { Injectable } from '@angular/core';
import { isNil, isNull } from 'lodash';
import { Observable, of } from 'rxjs';

import { State } from '../state/app.state';
import { PuzzleGameState } from '../pages/games/puzzle/state/puzzle.reducer';
import {Store} from "@ngrx/store";
import {initialAppState} from "../state/app.reducers";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private DEFAULT_LOCAL_DATA: State = initialAppState();
  private LOCAL_KEY: string = 'local-site-storage';

  constructor(private store: Store<State>) {
  }

  loadPuzzleGameData(): Observable<PuzzleGameState> {
    const storageData = this.getLocalData();
    return isNull(storageData.puzzleGame) ? of(this.DEFAULT_LOCAL_DATA.puzzleGame) : of(storageData.puzzleGame);
  }

  syncLoadPuzzleGameData(): PuzzleGameState {
    const storageData = this.getLocalData();
    return isNull(storageData.puzzleGame) ? this.DEFAULT_LOCAL_DATA.puzzleGame : storageData.puzzleGame;
  }

  saveData(localData: State): Observable<State> {
    localStorage.setItem(this.LOCAL_KEY, JSON.stringify(localData));
    return of(this.getLocalData());
  }

  syncSaveData(localData: State): State {
    localStorage.setItem(this.LOCAL_KEY, JSON.stringify(localData));
    return this.getLocalData();
  }

  private getLocalData(): State {
    const data = localStorage.getItem(this.LOCAL_KEY);
    if (isNil(data)) {
      return null;
    }
    const localData = JSON.parse(data) as State;
    return localData;
  }
}
