import { Component, OnInit } from '@angular/core';
import { GameBoardService } from '../game-board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  leftPlayer: string;
  topPlayer: string;
  rightPlayer: string;
  leftPlayerIndex: number;
  topPlayerIndex: number;
  rightPlayerIndex: number;
  bottomPlayerIndex: number;
  playedCardClasses: string[] = [
    'played-card-bottom',
    'played-card-left',
    'played-card-top',
    'played-card-right'
  ];

  constructor(public gameService: GameBoardService) {}

  ngOnInit() {
    this.gameService.getCards();
    this.initPlayerPositions();
  }

  private initPlayerPositions() {
    this.gameService.userName = 'Jasper';
    let myIndex: number;
    // Find the index of the active player
    this.gameService.staticPlayers.forEach((player, index) => {
      this.gameService.userName === player.name ? (myIndex = index) : null;
    });

    this.bottomPlayerIndex = myIndex;
    this.leftPlayer = this.gameService.staticPlayers[(myIndex + 1) % 4].name;
    this.topPlayer = this.gameService.staticPlayers[(myIndex + 2) % 4].name;
    this.rightPlayer = this.gameService.staticPlayers[(myIndex + 3) % 4].name;
  }

  public getPlayedCardClass(playerIndex: number): string {
    const styleIndex = (playerIndex - this.bottomPlayerIndex + 4) % 4;
    return this.playedCardClasses[styleIndex];
  }
}
