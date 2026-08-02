import { Component, forwardRef, input as ngInput } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
})
export class Input implements ControlValueAccessor {
  readonly inputId = `app-input-${nextId++}`;

  label = ngInput<string>('');
  type = ngInput<'text' | 'email' | 'password' | 'number'>('text');
  placeholder = ngInput<string>('');
  errorMessage = ngInput<string>('');
  required = ngInput(false);
  min = ngInput<number | string | null>(null);
  max = ngInput<number | string | null>(null);

  value: string | number = '';
  disabled = false;

  private onChange: (value: string) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: string): void {
    this.value = value ?? '';
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.value = this.type() === 'number' ? this.parseNumber(raw) : raw;
    this.onChange(this.value as any);
  }

  private parseNumber(raw: string): number | string {
    if (raw === '') return '';
    const parsed = Number(raw);
    return isNaN(parsed) ? '' : parsed;
  }
}
