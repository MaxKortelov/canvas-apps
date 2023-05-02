import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  GAMES = [
    {
      name: 'puzzle',
      icon: 'puzzle-game.svg',
      route: '/games/puzzle'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
