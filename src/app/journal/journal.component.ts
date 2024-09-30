import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css'],
  imports: [FormsModule]
})
export class JournalComponent implements OnInit {
  journalEntry: string = '';
  journalDate: string = ''; // För datumet
  savedJournals: { entry: string, date: string }[] = [];
  formattedJournals: string = '';

  ngOnInit() {
    const storedJournals = localStorage.getItem('journals');
    if (storedJournals) {
      this.savedJournals = JSON.parse(storedJournals);
      this.updateFormattedJournals();
    }
  }

  postJournal() {
    const date = this.journalDate ? this.journalDate : new Date().toISOString().split('T')[0]; // Standard till dagens datum
    if (this.journalEntry.trim()) {
      this.savedJournals.push({ entry: this.journalEntry, date: date });
      localStorage.setItem('journals', JSON.stringify(this.savedJournals));
      this.updateFormattedJournals();
      this.journalEntry = '';
      this.journalDate = ''; // Nollställ datumfältet
    }
  }

  updateFormattedJournals() {
    this.formattedJournals = this.savedJournals
      .map((journal, index) => `<strong>Post ${index + 1} (${journal.date}):</strong> ${journal.entry}`)
      .join('<br><br>');
  }
}
