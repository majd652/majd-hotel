import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  value = model('');
  placeholder = input('Search...');

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
