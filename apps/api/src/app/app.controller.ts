import { Controller, Get, Res } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AppService } from './app.service';
import { LatestRates, Currency } from '@currency-exchange/api-interfaces';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // root(@Res() response): void {
  //   response.sendFile(path.resolve('./index.html'));
  // }

  @Get('rates')
  getRates(): Observable<LatestRates> {
    return this.appService.getRates();
  }

  @Get('currencies')
  getData(): Observable<Currency[]> {
    return this.appService.getCurrencies();
  }
}
