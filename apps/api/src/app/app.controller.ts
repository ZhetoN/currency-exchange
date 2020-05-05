import { Controller, Get, Res, Param } from '@nestjs/common';
import { Observable } from 'rxjs';

import { AppService } from './app.service';
import { LatestRates, Currency } from '@currency-exchange/api-interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('rates')
  getRates(@Param('base') base: string): Observable<LatestRates> {
    return this.appService.getRates(base);
  }

  @Get('currencies')
  getData(): Observable<Currency[]> {
    return this.appService.getCurrencies();
  }
}
