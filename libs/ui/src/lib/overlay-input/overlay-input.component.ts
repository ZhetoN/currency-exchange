import { InputComponent } from '../input/input.component';
import { AfterViewInit, Component, ElementRef, HostListener, Injector, Input, OnDestroy, ViewChild } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';
import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ConnectionPositions } from './overlay-positions';
import { ReplaySubject } from 'rxjs';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  template: '',
  styleUrls: [
    './overlay-input.component.scss'
  ]
})
export class OverlayInputComponent extends InputComponent implements AfterViewInit, OnDestroy {

  @ViewChild(CdkPortal, { static: false }) public contentTemplate: CdkPortal;

  connectedPositions: ConnectedPosition[] = [
    ConnectionPositions.BottomRight,
    ConnectionPositions.TopRight,
  ];

  overlayWidth$: ReplaySubject<number> = new ReplaySubject(1);
  overlayHeight$: ReplaySubject<number> = new ReplaySubject(1);

  protected _overlayRef: OverlayRef;
  protected _elmRef: ElementRef;
  protected _overlay: Overlay;

  @Input() displayWith: (value: any) => SafeHtml | string = (value: any) => value.toString();

  constructor(injector: Injector) {
    super(injector);
    this._elmRef = injector.get(ElementRef);
    this._overlay = injector.get(Overlay);
  }

  @HostListener('window:resize') onResize() {
    if (this._overlayRef.hasAttached()) {
      this.updateWidth();
    }
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    const positionStrategy = this._overlay.position()
      .flexibleConnectedTo(this._elmRef.nativeElement)
      .withPositions(this.connectedPositions);

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      scrollStrategy: this._overlay.scrollStrategies.reposition()
    });

    this._overlayRef = this._overlay.create(overlayConfig);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._overlayRef.detach();
    this._overlayRef.dispose();
  }

  focusChanged(isFocused: boolean): void {
    super.focusChanged(isFocused);
    if (this._focused) {
      this.showOverlay();
    } else {
      this.hideOverlay();
    }
  }

  protected showOverlay(): void {
    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this.contentTemplate);
      this.updateWidth();
    }
  }

  protected hideOverlay(): void {
    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
    }
  }

  protected updateWidth(): void {
    this.overlayWidth$.next(
      (this._elmRef.nativeElement as HTMLElement).getBoundingClientRect().width
    );
  }
}
