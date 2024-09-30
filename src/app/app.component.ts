import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { JournalComponent } from './journal/journal.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <app-login [hidden]="isLoggedIn" (loginSuccess)="onLoginSuccess($event)"></app-login>
    <app-home [hidden]="!isLoggedIn || showJournal" (journalPage)="onJournalPage()"></app-home>
    <app-journal [hidden]="!showJournal"></app-journal>
  `,
  imports: [LoginComponent, HomeComponent, JournalComponent]
})
export class AppComponent {
  isLoggedIn = false; // Inloggningsstatus
  showJournal = false; // Status för Journal-sidan

  onLoginSuccess(username: string) {
    console.log('Du är inloggad!');
    console.log(`Användarnamn: ${username}`);
    this.isLoggedIn = true; // Sätt statusen till inloggad
  }

  onJournalPage() {
    this.showJournal = true; // Visa Journal-sidan
  }
}

