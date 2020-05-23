import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() cardValue: number;
  cardNumber: string;
  cardType: number;
  specialCards: { number: number; replaceWith: string }[] = [
    {
      number: 10,
      replaceWith: 'J'
    },
    {
      number: 11,
      replaceWith: 'Q'
    },
    {
      number: 12,
      replaceWith: 'K'
    },
    {
      number: 13,
      replaceWith: 'A'
    }
  ];
  deckSize: number = 13;
  cardTypes: string[] = [
    '/assets/images/hearts.png',
    '/assets/images/diamonds.png',
    '/assets/images/clubs.png',
    '/assets/images/spades.png'
  ];

  constructor() {}

  ngOnInit() {
    this.getCardTypeAndNumber();
  }

  private getCardTypeAndNumber() {
    const cardIndex = 1 + this.cardValue % this.deckSize;
    this.cardType = Math.floor(this.cardValue / this.deckSize);

    this.cardNumber = String(cardIndex);
    this.specialCards.forEach(specialCard => {
      if (cardIndex === specialCard.number) {
        this.cardNumber = specialCard.replaceWith;
      }
    });
  }
}
