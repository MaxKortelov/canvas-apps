import { Component, OnInit } from '@angular/core';
import {tap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {State} from "../../../state/app.state";
import {LocalStorageService} from "../../../services/local-storage.service";
import * as fromPuzzleGameActions from "./state/puzzle.actions"

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent implements OnInit {

  constructor(private store: Store<State>, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.localStorageService.loadPuzzleGameData().pipe(
      tap((puzzleGameState) => {
        this.store.dispatch(fromPuzzleGameActions.setInitialPuzzleGameState({ puzzleGameState }));
      })
    ).subscribe();
  }

}
