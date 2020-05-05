import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, InjectionToken } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { UiModule } from '@currency-exchange/ui';
import { AppComponent } from './app.component';
import { DEFAULT_BASE_CURRENCY_CODE } from './default-currency';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    UiModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    {
      provide: DEFAULT_BASE_CURRENCY_CODE,
      useValue: 'USD'
    }
  ],
  bootstrap: [
  ],
  entryComponents: [
    AppComponent,
  ],
})
export class AppModule {
  constructor(private readonly injector: Injector) {
  }

  ngDoBootstrap() {
    /**
     * @font-face rules should be defined in main document in encapsulation.shadowDom
     * @link https://bugs.chromium.org/p/chromium/issues/detail?id=336876
     */
    const linkNode = document.createElement('link');
    linkNode.type = 'text/css';
    linkNode.rel = 'stylesheet';
    linkNode.href = '//fonts.googleapis.com/css?family=Roboto:300,400,500';
    document.head.appendChild(linkNode);

    const el = createCustomElement<AppComponent>(AppComponent, { injector: this.injector });
    customElements.define('currency-exchange', el);
  }
}
