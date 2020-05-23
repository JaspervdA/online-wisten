import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import {Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  gameJoined: boolean = false;
  gameStarted: boolean = false;
  userName: string;
  roomId: number = 1;
  cards: number[];
  public games: Observable<any>;
  public gamesRef: AngularFireList<any>

  constructor(private db: AngularFireDatabase) {
    this.gamesRef = db.list('/games');
    this.games = this.gamesRef.valueChanges();
  }

  public checkGames(){
    this.games.subscribe( games => console.log(games))
  }

  public joinRoom() {
    this.gameJoined = true;
  }

  public startGame() {
    this.gameStarted = true;
  }

  public getCards() {
    this.cards = Array.from(Array(52).keys());
  }
}
