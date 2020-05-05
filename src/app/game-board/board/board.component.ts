import { Component, OnInit } from '@angular/core';
import { GameBoardService } from '../game-board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  constructor(public gameService: GameBoardService) {}

  ngOnInit() {
    this.gameService.getCards()
  }
}
