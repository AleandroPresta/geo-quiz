import { Component, Input, OnInit } from '@angular/core';
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
  @Input() cluesToGuess: string = 'bollards';
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
  isQuizStarted: boolean = false;
  dataLoaded: boolean = false;

  constructor(private http: HttpClient) {}

  private shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  ngOnInit() {
    // ...existing code...
  }

  startQuiz(clueType: string) {
    this.cluesToGuess = clueType;
    this.isQuizStarted = true;
    this.dataLoaded = false;
    let dataUrl = '';
    switch (this.cluesToGuess) {
      case 'bollards':
        dataUrl = 'https://raw.githubusercontent.com/AleandroPresta/geo-quiz/refs/heads/master/src/assets/bollards.json';
        break;
      case 'telephone-poles':
        dataUrl = 'https://raw.githubusercontent.com/AleandroPresta/geo-quiz/refs/heads/master/src/assets/telephone-poles.json'; // Placeholder URL
        break;
      case 'license-plates':
        dataUrl = 'https://raw.githubusercontent.com/AleandroPresta/geo-quiz/refs/heads/master/src/assets/license-plates.json'; // Placeholder URL
        break;
      default:
        console.error('Unknown cluesToGuess type');
        return;
    }

    this.http.get(dataUrl)
      .subscribe((data: any) => {
        if (data && data[this.cluesToGuess]) {
          this.bollards = this.shuffle([...data[this.cluesToGuess]]);
          this.totalBollards = this.bollards.length;
          this.dataLoaded = true;
        } else {
          this.feedback = 'Work in progress';
          this.dataLoaded = false;
        }
      }, error => {
        this.feedback = 'Work in progress';
        this.dataLoaded = false;
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
