import { Component, OnInit } from '@angular/core';
import { GameBoardService } from '../game-board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  bottomPlayer: string;
  leftPlayer: string;
  topPlayer: string;
  rightPlayer: string;
  playedCardClasses: string[] = [
    'played-card-bottom',
    'played-card-left',
    'played-card-top',
    'played-card-right'
  ];

  constructor(public gameService: GameBoardService) {}

  ngOnInit() {
    this.initPlayerPositions();
  }

  private initPlayerPositions() {
    let myIndex: number = this.gameService.bottomPlayerIndex;
    this.bottomPlayer = this.gameService.staticPlayers[myIndex].name;
    this.leftPlayer = this.gameService.staticPlayers[(myIndex + 1) % 4].name;
    this.topPlayer = this.gameService.staticPlayers[(myIndex + 2) % 4].name;
    this.rightPlayer = this.gameService.staticPlayers[(myIndex + 3) % 4].name;
  }

  public getPlayedCardClass(playerIndex: number): string {
    const styleIndex =
      (playerIndex - this.gameService.bottomPlayerIndex + 4) % 4;
    return this.playedCardClasses[styleIndex];
  }
}
