import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-emotion',
  templateUrl: './emotion.component.html',
  styleUrls: ['./emotion.component.css'],
  imports: [FormsModule]
})
export class EmotionComponent {
  selectedEmotion: string = 'Neutral'; // Standard känsla

  selectEmotion(emotion: string) {
    this.selectedEmotion = emotion; // Uppdatera känslan när en emoji klickas
  }
}