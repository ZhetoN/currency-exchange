import { Injectable, HttpService } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map, tap, shareReplay, catchError } from 'rxjs/operators';

import { LatestRatesQueryParams, LatestRates, Currency, CurrencyResponse } from '@currency-exchange/api-interfaces';

@Injectable()
export class AppService {

  private currencies$ = this.http.get<CurrencyResponse[]>('https://openexchangerates.org/api/currencies.json')
    .pipe(
      catchError(() => of({ data: [] })),
      map(response => Object.keys(response.data).map(key => ({ code: key, name: response.data[key] }))),
      tap(response => console.log(response)),
      shareReplay(1),
    );

  constructor(private http: HttpService) {
  }

  getRates(base = 'EUR'): Observable<LatestRates> {
    const params: LatestRatesQueryParams = {
      app_id: 'd12f071236614a5db99ed40a3803cdb8',
      base,
    };
    return this.http.get<LatestRates>('https://openexchangerates.org/api/latest.json', { params })
      .pipe(
        map(response => response.data),
        tap(response => console.log(response)),
      );
  }

  getCurrencies(): Observable<Currency[]> {
    return this.currencies$;
  }

}
