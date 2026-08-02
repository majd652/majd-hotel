import { Component, forwardRef, input as ngInput, output, signal } from '@angular/core';
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
  value = ngInput<string | number | null>(null);
  valueChange = output<string | number | null>();

  disabled = false;
  private internalValue = signal<string | number | null>(null);
  private onChange: (v: string | number | null) => void = () => { };
  onTouched: () => void = () => { };

  get currentValue(): string | number | null {
    return this.value() ?? this.internalValue();
  }

  writeValue(v: string | number | null): void { this.internalValue.set(v); }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  onSelect(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    let newValue: string | number | null;
    if (raw === '') {
      newValue = null;
    } else {
      const matched = this.options().find((o) => String(o.value) === raw);
      newValue = matched ? matched.value : raw;
    }
    this.internalValue.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }
}