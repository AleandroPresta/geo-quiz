import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  bollards: any[] = [];
  currentBollardIndex: number = 0;
  userAnswer: string = '';
  feedback: string = '';
  incorrectAnswers: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://raw.githubusercontent.com/AleandroPresta/geo-quiz/refs/heads/master/src/assets/bollards.json')
      .subscribe((data: any) => {
        this.bollards = data.bollards;
      });
  }

  checkAnswer() {
    if (this.userAnswer.toLowerCase() === this.bollards[this.currentBollardIndex].country.toLowerCase()) {
      this.feedback = 'Correct!';
    } else {
      this.feedback = 'Incorrect, try again.';
      this.incorrectAnswers.push(this.bollards[this.currentBollardIndex]);
    }
    setTimeout(() => {
      this.nextQuestion();
    }, 1000); // Wait for 1 second before moving to the next question
  }

  nextQuestion() {
    if (this.currentBollardIndex < this.bollards.length - 1) {
      this.currentBollardIndex++;
    } else if (this.incorrectAnswers.length > 0) {
      this.bollards = this.incorrectAnswers;
      this.incorrectAnswers = [];
      this.currentBollardIndex = 0;
    } else {
      this.feedback = 'Quiz completed!';
      return;
    }
    this.userAnswer = '';
    this.feedback = '';
  }
}
