import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  GAMES = [
    {
      icon: 'puzzle-game.svg',
      name: 'Puzzle',
      description: 'Put all together pieces in a single picture.',
      route: '/games/puzzle'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
