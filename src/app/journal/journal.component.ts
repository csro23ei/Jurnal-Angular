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
  savedJournals: { entry: string; date: string; emotion: string; _id: string }[] = []; // Lägg till _id för borttagning
  filteredJournals: { entry: string; date: string; emotion: string; _id: string }[] = []; // Ny variabel för filtrerade journaler
  formattedJournals: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  userId: string = '';
  startDate: string = ''; // New variable for start date
  endDate: string = '';  // Ny variabel för att hålla det sökta datumet

  @ViewChild(EmotionComponent) emotionComponent!: EmotionComponent;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';

    console.log('UserId från localStorage:', this.userId);

    if (this.userId) {
      this.loadSavedJournals();
    } else {
      this.errorMessage = 'Ingen användaridentifierare hittades.';
    }
  }

  loadSavedJournals() {
    const url = 'http://localhost:8080/api/journal/entries';
    const headers = new HttpHeaders().set('userId', this.userId);

    console.log('Skickar förfrågan med userId:', this.userId);

    this.http.get(url, { headers }).subscribe(
      (data: any) => {
        this.savedJournals = data;
        this.filteredJournals = data; // Initiera filtrerade journaler med alla journaler
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
    this.formattedJournals = this.filteredJournals
      .map((journal, index) => `<strong>Post ${index + 1} (${journal.date}, Känsla: ${journal.emotion}):</strong> ${journal.entry} <button onclick="angularComponent.deleteJournal('${journal._id}')"></button>`)
      .join('<br><br>');
  }

  deleteJournal(journalId: string) {
    const url = `http://localhost:8080/api/journal/delete/${journalId}`;
    const headers = new HttpHeaders().set('userId', this.userId);
  
    this.http.delete(url, { headers }).subscribe(
      (response) => {
        this.successMessage = 'Journalen togs bort framgångsrikt!';
        this.errorMessage = '';
        this.loadSavedJournals(); 
      },
      (error) => {
        console.error('Fel vid borttagning av journal', error);
        this.errorMessage = `Kunde inte ta bort journal. Fel: ${error.message}`;
        this.successMessage = '';
      }
    );
  }

  searchByDateRange() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      this.filteredJournals = this.savedJournals.filter(journal => {
        const journalDate = new Date(journal.date);
        return journalDate >= start && journalDate <= end; // Check if the journal date is within the range
      });
    } else {
      this.filteredJournals = this.savedJournals; // If no dates provided, show all journals
    }
    this.updateFormattedJournals(); // Update the formatted journals
  }
}

