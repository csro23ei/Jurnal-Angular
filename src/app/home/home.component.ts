import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @Output() journalPage = new EventEmitter<void>(); // Utritning av händelse

  navigateToJournal() {
    this.journalPage.emit(); // Emittera händelse för att navigera
  }
}
