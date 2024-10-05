import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';

import { JournalComponent } from './journal/journal.component';
import { RegisterComponent } from './register/register.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <div style="text-align: center;">
      <button (click)="showLogin()" [hidden]="isLoggedIn">Logga in</button>
      <button (click)="showRegister()" [hidden]="isLoggedIn">Registrera</button>
    </div>
    <app-login [hidden]="!isLoginVisible" (loginSuccess)="onLoginSuccess($event)"></app-login>
    <app-register [hidden]="!isRegisterVisible" (registrationSuccess)="onRegistrationSuccess()"></app-register>
   
    <app-journal [hidden]="!showJournal"></app-journal>
  `,
  imports: [LoginComponent,  JournalComponent, RegisterComponent],
})
export class AppComponent {
  isLoggedIn = false;
  showJournal = false;
  isLoginVisible = true;
  isRegisterVisible = false;

  showLogin() {
    this.isLoginVisible = true;
    this.isRegisterVisible = false;
  }

  showRegister() {
    this.isLoginVisible = false;
    this.isRegisterVisible = true;
  }

  onLoginSuccess(username: string) {
    console.log('Du är inloggad!');
    console.log(`Användarnamn: ${username}`);
    this.isLoggedIn = true;
    this.isLoginVisible = false;
    this.isRegisterVisible = false;
    this.showJournal = true; 
  }

  onRegistrationSuccess() {
    console.log('Registrering lyckades!');
    this.isLoggedIn = true;
    this.isLoginVisible = false;
    this.isRegisterVisible = false;
    this.showJournal = true; 
  }

  onJournalPage() {
    this.showJournal = true; 
  }
}
