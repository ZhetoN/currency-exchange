import { Component, OnDestroy } from '@angular/core';

import { AppService } from './app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { Currency } from '@currency-exchange/api-interfaces';
import { map, tap, filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
    amount: new FormControl(110),
    from: new FormControl(),
    to: new FormControl()
  }) as FormGroupTyped<{ amount: number, from: Currency, to: Currency }>;

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
