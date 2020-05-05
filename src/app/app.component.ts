import { Component } from '@angular/core';
import { GameBoardService } from './game-board/game-board.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'online-wisten';

  constructor(public gameService: GameBoardService) {}

}
