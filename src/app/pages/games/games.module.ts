import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesComponent } from './games.component';
import { PuzzleModule } from './puzzle/puzzle.module';
import { GamesRoutingModule } from './games-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [GamesComponent],
  imports: [CommonModule, PuzzleModule, GamesRoutingModule]
})
export class GamesModule {}
