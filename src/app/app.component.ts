import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuizComponent } from "./quiz/quiz.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QuizComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'geo-quiz';
  selectedClue: string = 'bollards';

  selectClue(clue: string) {
    this.selectedClue = clue;
  }
}
