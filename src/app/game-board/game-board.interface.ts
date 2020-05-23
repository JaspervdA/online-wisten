// We can initialise an interface as follows
// const player = {} as IPlayer;

export interface Player {
  name: string;
  id: string;
}

export interface Round {
  winnerId: number;
  playedCards: number[];
}

export interface Game {
  id: number;
  trumpColor: number;
  rounds: Round[];
}

export interface Room {
  name: string;
  players: Player[];
  games: Game[];
}
