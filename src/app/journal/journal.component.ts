import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmotionComponent } from '../emotion/emotion.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css'],
  imports: [FormsModule, EmotionComponent],
})
export class JournalComponent implements OnInit {
  journalEntry: string = '';
  journalDate: string = '';
  savedJournals: { entry: string; date: string; emotion: string }[] = [];
  formattedJournals: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  userId: string = '';

  @ViewChild(EmotionComponent) emotionComponent!: EmotionComponent;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || ''; // Kolla för userId

    console.log('UserId från localStorage:', this.userId);

    if (this.userId) {
      this.loadSavedJournals(); // Ladda sparade journaler om userId finns
    } else {
      this.errorMessage = 'Ingen användaridentifierare hittades.'; // Hantera fall där userId inte hittas
    }
  }

  loadSavedJournals() {
    const url = 'http://localhost:8080/api/journal/entries';
    const headers = new HttpHeaders().set('userId', this.userId);

    console.log('Skickar förfrågan med userId:', this.userId);

    this.http.get(url, { headers }).subscribe(
      (data: any) => {
        this.savedJournals = data;
        this.updateFormattedJournals();
      },
      (error) => {
        console.error('Fel vid inläsning av journaler', error);
        this.errorMessage = 'Kunde inte ladda journaler.';
      }
    );
  }

  postJournal() {
    const date = this.journalDate ? this.journalDate : new Date().toISOString().split('T')[0];
    const emotion = this.emotionComponent.selectedEmotion;
    const newJournal = { entry: this.journalEntry, date: date, emotion: emotion, userId: this.userId };

    const url = 'http://localhost:8080/api/journal/save';
    const headers = new HttpHeaders().set('userId', this.userId);

    this.http.post(url, newJournal, { headers }).subscribe(
      (response: any) => {
        this.successMessage = 'Journalen sparades framgångsrikt!';
        this.errorMessage = '';
        this.loadSavedJournals();
        this.journalEntry = '';
        this.journalDate = '';
      },
      (error) => {
        console.error('Fel vid sparande av journal', error);
        this.errorMessage = `Kunde inte spara journal. Fel: ${error.message}`;
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

