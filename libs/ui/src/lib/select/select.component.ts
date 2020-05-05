import { Component, Injector, Input, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import * as deepEqual from 'fast-deep-equal';
import { SafeHtml } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { OverlayInputComponent } from '../overlay-input/overlay-input.component';
import { shareReplay, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/overlay';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

let nextUniqueId = 0;

@Component({
  selector: 'currency-exchange-select',
  templateUrl: './select.component.html',
  styleUrls: [
    '../input/input.component.scss',
    './select.component.scss',
  ],
})
export class SelectComponent extends OverlayInputComponent {

  scrollDispatcher: ScrollDispatcher;

  private _options: any[];
  @Input() set options(options: any[]) {
    this._options = options;
    const len = this._options ? this._options.length : 0;
    this.overlayHeight$.next(len * this.itemSize);
  };

  get options(): any[] {
    return this._options;
  }

  @Input() itemSize = 32;

  select$ = new Subject<any>();

  protected _uid = `currency-exchange-select-${nextUniqueId++}`;

  constructor(protected injector: Injector) {
    super(injector);
    this.scrollDispatcher = this.injector.get(ScrollDispatcher);
  }

  private _compareWith: (actual: any, expected: any, opts?: any) => boolean = deepEqual;

  @Input() displayWith: (option: any) => SafeHtml | string = (option: any) => option.toString();
  @Input() valueWith: (value: any) => string = (value: any) => value.toString();

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

  public isSelected(option: any): boolean {
    return this._compareWith(this.control.value, option);
  }

  select(value: any) {
    this.select$.next(value);
  }

  valueChanges() {
    this.select$.pipe(
      shareReplay(1),
      takeUntil(this.destroy$),
    ).subscribe((value: any) => {
      this._onChange(value);
      this.writeValue(value);
      this.focusChanged(false);
      const document = this.injector.get(DOCUMENT);
      (document.activeElement as HTMLInputElement).blur();
    });
  }

  writeValue(value: any): void {
    this.control.setValue(this.valueWith(value), { emitEvent: false });
  }

  protected showOverlay(): void {
    super.showOverlay();
    const scrollContainers = Array.from(this.scrollDispatcher.scrollContainers.keys());
    const cdkScrollable = scrollContainers.find(container =>
      this._overlayRef.hostElement.contains(container.getElementRef().nativeElement)
    ) as CdkVirtualScrollViewport;

    const index = this._options.findIndex(option => this._compareWith(option, this.control.value));
    const ngZone = this.injector.get(NgZone);
    ngZone.onStable.pipe(
      takeUntil(cdkScrollable.scrolledIndexChange)
    ).subscribe(() => {
      cdkScrollable.scrollToIndex(index);
    });
  }

  trackByIdx(i: number): number {
    return i;
  }
}
