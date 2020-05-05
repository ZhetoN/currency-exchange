import { Injectable, Inject } from '@angular/core';
import { shareReplay, switchMap, withLatestFrom, tap, distinctUntilChanged, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Currency, LatestRates } from '@currency-exchange/api-interfaces';
import { ReplaySubject } from 'rxjs';
import { DEFAULT_BASE_CURRENCY_CODE } from './default-currency';

@Injectable()
export class AppService {

  baseCurrencyCode$ = new ReplaySubject<string>(1);

  currencies$ = this.http.get<Currency[]>('/api/currencies')
    .pipe(shareReplay(1));

  rates$ = this.baseCurrencyCode$.pipe(
    distinctUntilChanged(),
    switchMap(code => this.http.get<LatestRates>('/api/rates', {
      params: new HttpParams().set('base', code)
    })),
    map(data => data.rates),
  );

  constructor(private http: HttpClient,
              @Inject(DEFAULT_BASE_CURRENCY_CODE) baseCurrencyCode: string) {
    this.baseCurrencyCode$.next(baseCurrencyCode);
  }

  setBaseCurrency(currency: Currency): void {
    this.baseCurrencyCode$.next(currency.code);
  }
}