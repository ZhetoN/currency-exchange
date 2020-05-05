import { Component, OnDestroy } from '@angular/core';

import { AppService } from './app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { Currency } from '@currency-exchange/api-interfaces';
import { map, tap, filter, takeUntil, shareReplay, skipUntil, distinctUntilChanged } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';

@Component({
  selector: 'currency-exchange',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    AppService,
  ]
})
export class AppComponent implements OnDestroy {

  currencies$ = this.appService.currencies$;
  destroy$ = new Subject<void>();

  form = new FormGroup({
    amount: new FormControl(),
    from: new FormControl(),
    to: new FormControl()
  }) as FormGroupTyped<{ amount: number, from: Currency, to: Currency }>;

  converted$ = combineLatest([
    this.form.controls.amount.valueChanges.pipe(
      distinctUntilChanged(),
    ),
    this.appService.rates$,
    this.appService.baseCurrencyCode$,
  ])
  .pipe(
    map(([amount, rates, code]) => {
      return amount;
    }),
  );

  constructor(private appService: AppService) {
    this.currencies$
      .pipe(
        map(val => val.find(currency => currency.code === 'USD')),
        takeUntil(this.destroy$),
      )
      .subscribe(val => {
        if (val) {
          this.form.controls.from.setValue(val);
        }
      });

    this.form.controls.from.valueChanges.pipe(
      distinctUntilChanged((prev, curr) => prev.code === curr.code),
      takeUntil(this.destroy$),
    ).subscribe(currency => {
      if (currency) {
        this.appService.setBaseCurrency(currency);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  displayWith(option: Currency): SafeHtml | string {
    return option ? `<div>${option.code}</div><small>${option.name}</small>` : '';
  }

  valueWith(value: Currency): string {
    return value ? value.code : '';
  }
}
