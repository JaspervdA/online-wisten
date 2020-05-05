import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'online-wisten';
  gameJoined: boolean = false;
  userName: string;

  public joinRoom() {
    this.gameJoined = true
  }
}
