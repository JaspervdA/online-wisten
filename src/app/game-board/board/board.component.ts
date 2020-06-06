import { Component, OnInit } from '@angular/core';
import { GameBoardService } from '../game-board.service';
import { Observable } from 'rxjs';
import { map, last } from 'rxjs/operators';

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
  leftPlayerWins: Observable<number[]>;
  topPlayerWins: Observable<number[]>;
  bottomPlayerWins: Observable<number[]>;
  rightPlayerWins: Observable<number[]>;
  lastRoundWinner: any;

  constructor(public gameService: GameBoardService) { }

  ngOnInit() {
    this.initPlayerPositions();
  }

  private initPlayerPositions() {
    let myIndex: number = this.gameService.myPlayerIndex;
    this.bottomPlayer = this.gameService.staticPlayers[myIndex].name;
    this.leftPlayer = this.gameService.staticPlayers[(myIndex + 1) % 4].name;
    this.topPlayer = this.gameService.staticPlayers[(myIndex + 2) % 4].name;
    this.rightPlayer = this.gameService.staticPlayers[(myIndex + 3) % 4].name;

    this.bottomPlayerWins = this.getWins(myIndex);
    this.leftPlayerWins = this.getWins((myIndex + 1) % 4);
    this.topPlayerWins = this.getWins((myIndex + 2) % 4);
    this.rightPlayerWins = this.getWins((myIndex + 3) % 4);

    this.lastRoundWinner = this.gameService.winners.pipe(last())
  }

  public getPlayedCardClass(playerIndex: number): string {
    const styleIndex = (playerIndex - this.gameService.myPlayerIndex + 4) % 4;
    return this.playedCardClasses[styleIndex];
  }

  private getWins(playerIndex: number) {
    return this.gameService.winners.pipe(
      map(winners => winners.filter(winner => winner === playerIndex))
    );
  }
}
