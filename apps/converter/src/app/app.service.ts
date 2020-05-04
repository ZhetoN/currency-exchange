import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Currency } from '@currency-exchange/api-interfaces';

@Injectable()
export class AppService {

  currencies$ = this.http.get<Currency[]>('/api/currencies')
    .pipe(shareReplay(1));

  constructor(private http: HttpClient) {
  }
}