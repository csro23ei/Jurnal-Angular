import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmotionComponent } from '../emotion/emotion.component';
import { FormsModule } from '@angular/forms';

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
  errorMessage: string = '';  
  successMessage: string = '';  
  userId: string = '';  

  @ViewChild(EmotionComponent) emotionComponent!: EmotionComponent;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    console.log("UserId from localStorage:", this.userId); 

    if (this.userId) {
        this.loadSavedJournals();
    } else {
        this.errorMessage = 'Ingen användaridentifierare hittades.'; // No user ID found
    }
}

loadSavedJournals() {
  const url = 'http://localhost:8080/api/journal/entries';
  const headers = new HttpHeaders().set('userId', this.userId);
  
  console.log("Skickar förfrågan med userId:", this.userId); // Sending request with userId

  this.http.get(url, { headers }).subscribe(
      (data: any) => {
          this.savedJournals = data;
          this.updateFormattedJournals();
      },
      (error) => {
          console.error('Error loading journals', error);
          this.errorMessage = 'Kunde inte ladda journaler.'; // Could not load journals
      }
  );
}

  
  postJournal() {
    const date = this.journalDate ? this.journalDate : new Date().toISOString().split('T')[0];
    const emotion = this.emotionComponent.selectedEmotion;
    const newJournal = { entry: this.journalEntry, date: date, emotion: emotion };

    const url = 'http://localhost:8080/api/journal/save';
    const headers = new HttpHeaders().set('userId', this.userId);

    this.http.post(url, newJournal, { headers }).subscribe(
      (response: any) => {
        this.successMessage = 'Journal saved successfully!'; // Journal saved successfully
        this.errorMessage = '';
        this.loadSavedJournals();
        this.journalEntry = '';
        this.journalDate = '';
      },
      (error) => {
        console.error('Error saving journal', error);
        this.errorMessage = `Could not save journal. Error: ${error.message}`; // Error saving journal
        this.successMessage = '';
      }
    );
  }

  updateFormattedJournals() {
    this.formattedJournals = this.savedJournals
      .map((journal, index) => `<strong>Post ${index + 1} (${journal.date}, Känsla: ${journal.emotion}):</strong> ${journal.entry}`)
      .join('<br><br>');
  }
}
