import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @Output() journalPage = new EventEmitter<void>(); // Emit event for journal page
  @Output() staticsPage = new EventEmitter<void>(); // Emit event for statistics page

  navigateToJournal() {
    this.journalPage.emit(); // Emit event to navigate to journal
  }

}

