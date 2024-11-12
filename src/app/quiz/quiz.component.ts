import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
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
  correctAnswers: number = 0;
  totalBollards: number = 0;
  wasIncorrect: boolean = false;
  correctCountry: string = '';
  isQuizCompleted: boolean = false;

  constructor(private http: HttpClient) {}

  private shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  ngOnInit() {
    this.http.get('/assets/bollards.json')
      .subscribe((data: any) => {
        this.bollards = this.shuffle([...data.bollards]);
        this.totalBollards = this.bollards.length;
      });
  }

  checkAnswer() {
    if (this.userAnswer.toLowerCase() === this.bollards[this.currentBollardIndex].country.toLowerCase()) {
      this.feedback = 'Correct!';
      this.correctAnswers++;
      this.wasIncorrect = false;
      this.correctCountry = '';
    } else {
      this.feedback = 'Incorrect, try again.';
      this.correctCountry = this.bollards[this.currentBollardIndex].country;
      this.incorrectAnswers.push({...this.bollards[this.currentBollardIndex], wasIncorrect: true});
      this.wasIncorrect = true;
    }
    setTimeout(() => {
      this.nextQuestion();
    }, 1000); // Wait for 1 second before moving to the next question
  }

  showAnswer() {
    this.correctCountry = this.bollards[this.currentBollardIndex].country;
    this.incorrectAnswers.push({...this.bollards[this.currentBollardIndex], wasIncorrect: true});
    this.wasIncorrect = true;
    setTimeout(() => {
      this.nextQuestion();
    }, 2000); // Wait for 2 seconds before moving to the next question
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
      this.isQuizCompleted = true;
      return;
    }
    this.userAnswer = '';
    this.feedback = '';
    this.wasIncorrect = this.bollards[this.currentBollardIndex]?.wasIncorrect || false;
    this.correctCountry = '';
  }
}
