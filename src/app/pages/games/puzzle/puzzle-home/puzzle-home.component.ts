import { Component, OnInit } from '@angular/core';
import { LEVEL } from '../../../../models/Puzzle';
import { State } from '../../../../state/app.state';
import { Store } from '@ngrx/store';
import * as fromPuzzleGameActions from '../state/puzzle.actions';

@Component({
  selector: 'app-puzzle-home',
  templateUrl: './puzzle-home.component.html',
  styleUrls: ['./puzzle-home.component.scss']
})
export class PuzzleHomeComponent implements OnInit {
  DIFFICULTY = this.setLevels();

  constructor(private store: Store<State>) {}

  ngOnInit(): void {}

  switchLevel(lvl: string): void {
    const level = LEVEL[lvl.replace(' ', '_') as unknown as LEVEL] as unknown as LEVEL;
    this.store.dispatch(fromPuzzleGameActions.changeDifficulty({ level }));
  }

  private setLevels(): string[] {
    return Object.values(LEVEL)
      .filter((key) => typeof key === 'string')
      .map((key) => (key as string).replace('_', ' '));
  }
}
