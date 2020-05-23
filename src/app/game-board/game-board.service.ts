import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { Game, Player, Room } from './game-board.interface';

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
  public playersRef: AngularFireList<Player>;
  public players: Observable<Player[]>;
  public staticPlayers: Player[];
  public userName: string;
  public playerId: string;
  public myPlayerIndex: number;
  public playedCards: Observable<number[]>;
  private cardPlayed: boolean = false;
  public gameId: number = 0;
  public roundId: number = 0;

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
        this.myPlayerIndex = index;
      }
    });
  }
  private checkIfCardsChanged() {
    this.games.subscribe((games: Game[]) => {
      if (!this.cards) {
        this.getCardsObservable();
      }
      this.gameStarted = true;
    });
  }

  public playCard(cardValue: number, firebaseIndex: number) {
    if (this.cardPlayed === true) {
      return;
    } else {
      this.db.database
        .ref(
          `rooms/${this.roomId}/games/${this.gameId}/playedCards/${
            this.roundId
          }/${this.myPlayerIndex}`
        )
        .set(cardValue)
        .then(response => (this.cardPlayed = true));

      this.db.database
        .ref(
          `rooms/${this.roomId}/games/${this.gameId}/cards/${
            this.myPlayerIndex
          }/${firebaseIndex}`
        )
        .remove();
    }
  }

  private newRound() {
    this.cardPlayed = false;
    this.roundId += 1;
  }

  private getCardsObservable() {
    let gameIndex$ = new BehaviorSubject(this.gameId);
    let roundIndex$ = new BehaviorSubject(this.roundId);
    this.cards = combineLatest(
      gameIndex$,
      this.games,
      (gameIndex, arr) => arr[gameIndex].cards[this.myPlayerIndex]
    );
    this.playedCards = combineLatest(
      gameIndex$,
      roundIndex$,
      this.games,
      (gameIndex, roundIndex, arr) => arr[gameIndex].playedCards[roundIndex]
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
      cards: this.tempCards,
      playedCards: this.initialisePlayedCards()
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

  private initialisePlayedCards() {
    let playedRound: number[] = new Array(4).fill(-1);
    let playedCards: number[][] = [];
    for (let i = 0; i < 13; i++) {
      playedCards.push(playedRound);
    }
    return playedCards;
  }
}
