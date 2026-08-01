import { Component, forwardRef, input as ngInput } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string | number;
}

let nextId = 0;

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Dropdown), multi: true }],
})
export class Dropdown implements ControlValueAccessor {
  readonly selectId = `app-dropdown-${nextId++}`;

  label = ngInput<string>('');
  placeholder = ngInput<string>('Select...');
  options = ngInput<SelectOption[]>([]);
  errorMessage = ngInput<string>('');

  value: string | number | null = null;
  disabled = false;
  private onChange: (v: string | number | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(v: string | number | null): void { this.value = v; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  onSelect(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    this.value = raw === '' ? null : raw;
    this.onChange(this.value);
  }
}