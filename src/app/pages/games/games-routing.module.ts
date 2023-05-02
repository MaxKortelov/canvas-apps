import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games.component';
import { PuzzleComponent } from './puzzle/puzzle.component';

const routes: Routes = [
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  {
    path: '',
    component: GamesComponent,
    children: [
      {
        path: 'puzzle',
        component: PuzzleComponent
      }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule {}
