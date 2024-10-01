import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmotionComponent } from '../emotion/emotion.component';

@Component({
  standalone: true,
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css'],
  imports: [FormsModule, EmotionComponent]
})
export class JournalComponent implements OnInit {
  journalEntry: string = '';
  journalDate: string = '';
  savedJournals: { entry: string, date: string, emotion: string }[] = [];
  formattedJournals: string = '';

  @ViewChild(EmotionComponent) emotionComponent!: EmotionComponent;

  ngOnInit() {
    const storedJournals = localStorage.getItem('journals');
    if (storedJournals) {
      this.savedJournals = JSON.parse(storedJournals);
      this.updateFormattedJournals();
    }
  }

  postJournal() {
    const date = this.journalDate ? this.journalDate : new Date().toISOString().split('T')[0];
    const emotion = this.emotionComponent.selectedEmotion;

    if (this.journalEntry.trim()) {
      this.savedJournals.push({ entry: this.journalEntry, date: date, emotion: emotion });
      localStorage.setItem('journals', JSON.stringify(this.savedJournals));
      this.updateFormattedJournals();
      this.journalEntry = '';
      this.journalDate = '';
    }
  }

  updateFormattedJournals() {
    this.formattedJournals = this.savedJournals
      .map((journal, index) => `<strong>Post ${index + 1} (${journal.date}, Känsla: ${journal.emotion}):</strong> ${journal.entry}`)
      .join('<br><br>');
  }
}
