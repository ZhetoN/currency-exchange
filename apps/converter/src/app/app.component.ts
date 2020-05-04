import { Component } from '@angular/core';

import { AppService } from './app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { Currency } from '@currency-exchange/api-interfaces';

@Component({
  selector: 'currency-exchange',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    AppService,
  ]
})
export class AppComponent {

  currencies$ = this.appService.currencies$;

  form = new FormGroup({
    from: new FormControl(),
    to: new FormControl()
  }) as FormGroupTyped<{ from: number, to: number }>;

  constructor(private appService: AppService) {
  }

  displayWith(option: Currency): SafeHtml {
    return `<div>${option.code}</div><small>${option.name}</small>`;
  }
}
