import { NgModule } from '@angular/core';

import { HighlightSearchPipe } from './highlight-search.pipe';

@NgModule({
  declarations: [
    HighlightSearchPipe,
  ],
  exports: [
    HighlightSearchPipe,
  ],
})
export class PipesModule {
}
