export interface LatestRatesQueryParams {
  app_id:	string,
  base?: string,
  symbols?: string,
  prettyprint?: boolean,
  show_alternative?: boolean,
}

export  interface CurrencyRate {
  [key: string]: number;
}

export interface LatestRates {
  timestamp: number,
  base: string,
  rates: CurrencyRate[],
}

export  interface CurrencyResponse {
  [key: string]: string;
}
export interface Currency {
  code: string;
  name: string;
}