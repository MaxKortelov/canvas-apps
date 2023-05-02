import { Component, OnInit } from '@angular/core';
import { ThemeMode } from '../models/Shell';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  THEME_MODE: ThemeMode = ThemeMode.LIGHT;

  constructor() {}

  ngOnInit(): void {}

  public switchTheme(): void {
    this.THEME_MODE === ThemeMode.LIGHT ? (this.THEME_MODE = ThemeMode.DARK) : (this.THEME_MODE = ThemeMode.LIGHT);
  }

  get isDarkTheme(): boolean {
    return this.THEME_MODE === ThemeMode.DARK;
  }
}
