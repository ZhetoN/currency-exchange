import { Component, ChangeDetectionStrategy, Injector, Input, AfterViewInit, OnDestroy, HostBinding, HostListener } from '@angular/core';
import { NgControl, FormControl, ControlValueAccessor } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { distinctUntilChanged, shareReplay, takeUntil } from 'rxjs/operators';

let nextUniqueId = 0;

@Component({
  selector: 'currency-exchange-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input() label: string;
  @Input() required: boolean;
  @Input() readonly: boolean;
  @Input() disabled: boolean;
  @Input() spellcheck = true;
  @Input() autocomplete = 'on';
  @Input() type = 'text';

  control: any = new FormControl() as FormControlTyped<string>;

  protected ngControl: NgControl | null;
  protected destroy$ = new Subject<void>();
  protected _focused = false;

  constructor(protected injector: Injector) {
    this.ngControl = injector.get(NgControl, null);
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  protected _uid = `currency-exchange-input-${nextUniqueId++}`;

  public get uid(): string {
    return this._uid;
  }

  @HostBinding('class.empty') get isEmpty(): boolean {
    return this.empty;
  }

  @HostBinding('class.focused') get isFocused(): boolean {
    return this._focused;
  }

  @HostBinding('class.label-float') get shouldLabelFloat(): boolean {
    return this._focused || !!this.control.value;
  }

  @HostBinding('class.disabled') get isDisabled(): boolean {
    return this.control.disabled;
  }

  @HostBinding('class.readonly') get isReadonly(): boolean {
    return this.readonly;
  }

  @HostBinding('class.required') get isRequired(): boolean {
    return this.required;
  }

  @HostBinding('class.error') get isError(): boolean {
    return this.ngControl !== null && this.ngControl.touched === true && this.ngControl.invalid === true;
  }

  @HostListener('keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    const document = this.injector.get(DOCUMENT);
    (document.activeElement as HTMLInputElement).blur();
  }

  get empty(): boolean {
    return !this.control.value;
  }

  ngAfterViewInit(): void {
    this.valueChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  focusChanged(isFocused: boolean): void {
    if (isFocused !== this._focused && (!this.readonly || !isFocused)) {
      this._focused = isFocused;
    }

    if (!this._focused) {
      this._onTouched();
    }
  }

  /**
   * @description
   * The registered callback function called when a blur event occurs on the input element.
   */
  _onTouched = () => {
  };

  /**
   * @description
   * The registered callback function called when a change event occurs on the input element.
   */
  _onChange = (_: any) => {
  };

  /**
   * @description
   * Registers a function called when the control is changed.
   *
   * @param fn The callback function
   */
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  /**
   * @description
   * Registers a function called when the control is touched.
   *
   * @param fn The callback function
   */
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.control.disable();
  }

  valueChanges(): void {
    this.control.valueChanges.pipe(
      distinctUntilChanged(),
      shareReplay(1),
      takeUntil(this.destroy$),
    ).subscribe((val: any) => {
      this._onChange(val);
    });
  }

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }
}
