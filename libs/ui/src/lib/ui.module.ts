import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Overlay } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { InputComponent } from './input/input.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { OverlayInputComponent } from './overlay-input/overlay-input.component';
import { SelectComponent } from './select/select.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ScrollingModule,
    PortalModule,
  ],
  declarations: [
    FormFieldComponent,
    InputComponent,
    OverlayInputComponent,
    SelectComponent,
    AutocompleteComponent,
  ],
  exports: [
    FormFieldComponent,
    InputComponent,
    SelectComponent,
    AutocompleteComponent,
  ],
  providers: [
    {
      provide: Overlay,
      useClass: Overlay
    }
  ]
})
export class UiModule {
}
