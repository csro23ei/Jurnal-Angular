import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @Output() journalPage = new EventEmitter<void>(); // Emit event when navigating

  navigateToJournal() {
    this.journalPage.emit(); // Emit event to navigate to journal
  }
}
