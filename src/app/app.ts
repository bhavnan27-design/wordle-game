import { Component, ElementRef, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import simpleWords from './kid_friendly_words.json';
import complexWords from './five_letter_words.json';

type LetterProperty = 'char1' | 'char2' | 'char3' | 'char4' | 'char5';
type Difficulty = 'simple' | 'complex';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  @ViewChildren('letterInput') letterInputs!: QueryList<ElementRef<HTMLInputElement>>;

  protected readonly title = signal('hello-ss');
  char1 = '';
  char2 = '';
  char3 = '';
  char4 = '';
  char5 = '';
  difficulty: Difficulty = 'simple';
  guesses: string[] = [];
  target = this.getRandomWord();
  gameWon = false;
  answerRevealed = false;

  ngOnInit(): void {
    
  }

  getChar(index: number): string {
    return this[`char${index}` as LetterProperty];
  }

  setChar(index: number, value: string): void {
    const char = value.replace(/[^a-z]/gi, '').slice(0, 1);
    const property = `char${index}` as LetterProperty;
    this[property] = char;
  }

  allowAlphabeticInput(event: Event): void {
    const inputEvent = event as InputEvent;

    if (inputEvent.data && /[^a-z]/i.test(inputEvent.data)) {
      event.preventDefault();
    }
  }

  onLetterInput(index: number): void {
    if (this.getChar(index) && index < 5) {
      this.focusInput(index + 1)
    }
  }

  onBackspace(event: Event, index: number): void {
    if (!this.getChar(index) && index > 1) {
      event.preventDefault();
      this.focusInput(index - 1);
    }
  }

  private focusInput(index: number): void {
    this.letterInputs.get(index - 1)?.nativeElement.focus();
  }

  selectDifficulty(value: string): void {
    if (value === 'simple' || value === 'complex') {
      this.difficulty = value;
      this.resetGame();
    }
  }

  submitGuess(): void {
    const guess = [this.char1, this.char2, this.char3, this.char4, this.char5].join('');

    if (guess.length === 5 && this.guesses.length < 5 && !this.gameWon) {
      this.guesses.push(guess);
      this.gameWon = guess.toLowerCase() === this.target.word.toLowerCase();
      this.answerRevealed = !this.gameWon && this.guesses.length === 5;
      this.char1 = '';
      this.char2 = '';
      this.char3 = '';
      this.char4 = '';
      this.char5 = '';
    }

    this.focusInput(1);
  }

  nextGame(): void {
    this.resetGame();
  }

  private resetGame(): void {
    this.target = this.getRandomWord();
    this.guesses = [];
    this.gameWon = false;
    this.answerRevealed = false;
    this.char1 = '';
    this.char2 = '';
    this.char3 = '';
    this.char4 = '';
    this.char5 = '';
    this.focusInput(1);
  }

  private getRandomWord() {
    const wordList = this.difficulty === 'simple' ? simpleWords : complexWords;
    return wordList[Math.floor(Math.random() * wordList.length)];
  }

  getGuessLetter(row: number, column: number): string {
    return this.guesses[row]?.[column] ?? '';
  }

  getLetterStatus(row: number, column: number): 'correct' | 'present' | 'wrong' | '' {
    const letter = this.getGuessLetter(row, column).toLowerCase();
    const targetWord = this.target.word.toLowerCase();

    if (!letter) {
      return '';
    }

    if (targetWord[column] === letter) {
      return 'correct';
    }

    return targetWord.includes(letter) ? 'present' : 'wrong';
  }
}
