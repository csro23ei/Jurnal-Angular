import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmotionComponent } from '../emotion/emotion.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css'],
  imports: [FormsModule, EmotionComponent, CommonModule],
})
export class JournalComponent implements OnInit {
  journalEntry: string = '';
  journalDate: string = '';
  savedJournals: { entry: string; date: string; emotion: string; _id: string }[] = [];
  filteredJournals: { entry: string; date: string; emotion: string; _id: string }[] = [];
  formattedJournals: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  userId: string = '';
  startDate: string = '';
  endDate: string = '';
  
 
  emotionStats: { [emotion: string]: number } = { 
    "Väldigt bra": 0, 
    "Bra": 0, 
    "Neutral": 0, 
    "Lite stressad": 0, 
    "Stressad": 0, 
    "Väldigt dåligt": 0 
  };
  totalEntries: number = 0;

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
        this.filteredJournals = data; 
        this.updateFormattedJournals();
        this.calculateEmotionStats(); 
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
            return journalDate >= start && journalDate <= end;
        });
    } else {
        this.filteredJournals = this.savedJournals; 
    }
    this.calculateEmotionStats(); 
    this.updateFormattedJournals();
}

calculateEmotionStats() {
    this.totalEntries = this.filteredJournals.length;

  
    this.emotionStats = { 
        "Väldigt bra": 0, 
        "Bra": 0, 
        "Neutral": 0, 
        "Lite stressad": 0, 
        "Stressad": 0, 
        "Väldigt dåligt": 0 
    };

   
    this.filteredJournals.forEach(journal => {
        if (this.emotionStats[journal.emotion] !== undefined) {
            this.emotionStats[journal.emotion]++;
        }
    });
}

}