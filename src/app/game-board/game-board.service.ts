import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { Game, Player, Room, Round } from './game-board.interface';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  public loadingRoom: boolean = true;
  public gameJoined: boolean = false;
  public gameStarted: boolean = false;
  public roomId: string;
  public roomName: string;
  public tempCards: number[][];
  public cards: Observable<number[]>;
  public gamesRef: AngularFireList<Game>;
  public games: Observable<Game[]>;
  public gameId: number = 0;
  public playersRef: AngularFireList<Player>;
  public players: Observable<Player[]>;
  public staticPlayers: Player[];
  public userName: string;
  public playerId: string;
  public bottomPlayerIndex: number;
  public playedCards: number[];

  constructor(private db: AngularFireDatabase) {}

  public createRoom() {
    const newRoom = {
      name: this.roomName,
      games: [{ id: 0 } as Game],
      players: [{} as Player]
    } as Room;

    const roomId = this.makeId(6);
    this.db.database
      .ref(`rooms/${roomId}`)
      .set(newRoom)
      .then(response => this.joinRoom(roomId));
  }

  public checkIfValidRoomId(roomId: string) {
    this.db.database
      .ref('rooms')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()[roomId]) {
          this.roomId = roomId;
          this.loadingRoom = false;
          this.roomName = snapshot.val()[roomId].name;
          this.joinRoom(roomId);
        } else {
          this.loadingRoom = false;
          alert('De ingevoerde spelcode bestaat niet');
          return;
        }
      });
  }

  public joinRoom(roomId: string) {
    this.roomId = roomId;
    this.playersRef = this.db.list(`/rooms/${this.roomId}/players`);
    this.players = this.playersRef.valueChanges();
    this.gameJoined = true;
  }

  public addPlayerToRoom(newPlayerName: string) {
    if (this.playerId) {
      return;
    }
    this.userName = newPlayerName;
    this.playerId = this.makeId(12);
    this.playersRef.push({ name: newPlayerName, id: this.playerId });
  }

  public checkIfGameStarted() {
    this.players.subscribe((players: Player[]) => {
      players.length === 4 ? this.startNewGame(players) : null;
    });
  }

  public startNewGame(players: Player[]) {
    this.staticPlayers = players;
    this.getMyPlayerIndex(players);
    // One player shuffles the cards
    this.gamesRef = this.db.list(`/rooms/${this.roomId}/games`);
    this.games = this.gamesRef.valueChanges();
    if (this.playerId === this.staticPlayers[0].id) {
      this.getCards();
      this.uploadCards();
    }
    this.checkIfCardsChanged();
  }

  private getMyPlayerIndex(players: Player[]) {
    // Find the index of the active player
    players.forEach((player, index) => {
      if (this.playerId === player.id) {
        this.bottomPlayerIndex = index;
      }
    });
  }
  private checkIfCardsChanged() {
    this.games.subscribe((games: Game[]) => {
      this.getCardsObservable();
      this.gameStarted = true;
    });
  }

  private getCardsObservable() {
    let index$ = new BehaviorSubject(this.gameId);
    this.cards = combineLatest(
      index$,
      this.games,
      (index, arr) => arr[index].cards[this.bottomPlayerIndex]
    );
  }

  private initNewGameRound() {
    this.gameId += 1;
    // One player shuffles the cards
    if (this.playerId === this.staticPlayers[0].id) {
      this.getCards();
      this.uploadCards();
    }
  }

  private getCards() {
    let cards: number[] = Array.from(Array(52).keys());
    this.shuffleArray(cards);
    this.tempCards = [];
    for (let i = 0; i < 4; i++) {
      this.tempCards.push(cards.splice(0, 13));
    }
  }

  private uploadCards() {
    const newGame = {
      cards: this.tempCards
    } as Game;

    this.db.database
      .ref(`rooms/${this.roomId}/games/${this.gameId}`)
      .set(newGame);
  }

  private shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private makeId(idLength: number): string {
    let id = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < idLength; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
  }
}
