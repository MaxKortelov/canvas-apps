import { Component, OnInit } from '@angular/core';
import { LEVEL } from '../../../../models/Puzzle';
import { State } from '../../../../state/app.state';
import { Store } from '@ngrx/store';
import * as fromPuzzleGameActions from '../state/puzzle.actions';
import * as fromPuzzleGame from '../state';
import { map, tap } from 'rxjs/operators';
import {LocalStorageService} from "../../../../services/local-storage.service";

@Component({
  selector: 'app-puzzle-home',
  templateUrl: './puzzle-home.component.html',
  styleUrls: ['./puzzle-home.component.scss']
})
export class PuzzleHomeComponent implements OnInit {
  DIFFICULTY = this.setLevels();
  CURRENT_DIFFICULTY: string;
  name: string;

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.store
      .select(fromPuzzleGame.name)
      .pipe(tap((name) => (this.name = name)))
      .subscribe();

    this.store
      .select(fromPuzzleGame.SIZE)
      .pipe(
        map((SIZE) => {
          this.CURRENT_DIFFICULTY = LEVEL[SIZE.rows].replace('_', ' ');
        })
      )
      .subscribe();
  }

  switchLevel(lvl: string): void {
    const level = LEVEL[lvl.replace(' ', '_') as unknown as LEVEL] as unknown as LEVEL;
    this.store.dispatch(fromPuzzleGameActions.changeDifficulty({ level }));
  }

  changeName(event: Event): void {
    this.store.dispatch(fromPuzzleGameActions.changeName({ name: (event.target as HTMLInputElement).value }));
  }

  private setLevels(): string[] {
    return Object.values(LEVEL)
      .filter((key) => typeof key === 'string')
      .map((key) => (key as string).replace('_', ' '));
  }
}
