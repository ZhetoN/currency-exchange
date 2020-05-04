import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import * as deepEqual from 'fast-deep-equal';
import { SafeHtml } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { OverlayInputComponent } from '../overlay-input/overlay-input.component';

let nextUniqueId = 0;

@Component({
  selector: 'currency-exchange-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: [
    '../input/input.component.scss',
    './autocomplete.component.scss',
  ],
})
export class AutocompleteComponent extends OverlayInputComponent {

  private _options: any[];
  @Input() set options(options: any[]) {
    this._options = options;
    const len = this._options ? this._options.length : 0;
    this.overlayHeight$.next(len * this.itemSize);
  };

  get options(): any[] {
    return this._options;
  }

  @Output() valueChange = new EventEmitter();

  @Input() itemSize = 32;

  protected _uid = `currency-exchange-autocomplete-${nextUniqueId++}`;

  constructor(protected injector: Injector) {
    super(injector);
  }

  private _compareWith: (actual: any, expected: any, opts?: any) => boolean = deepEqual;

  @Input() displayWith: (option: any) => SafeHtml | string = (option: any) => option.toString();

  /**
   * @description
   * Tracks the option comparison algorithm for tracking identities when checking for changes.
   */
  @Input()
  public set compareWith(fn: (actual: any, expected: any, opts?: any) => boolean) {
    if (typeof fn !== 'function') {
      throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
    }
    this._compareWith = fn;
  }

  onSelect(option: any) {
    this.control.reset();
    this.valueChange.emit(option);
    this.focusChanged(false);
    const document = this.injector.get(DOCUMENT);
    (document.activeElement as HTMLInputElement).blur();
  }

  trackByIdx(i: number): number {
    return i;
  }
}
