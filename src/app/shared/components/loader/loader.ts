import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  size = input<'sm' | 'md' | 'lg'>('md');
  fullPage = input(false);
  text = input('');
}
