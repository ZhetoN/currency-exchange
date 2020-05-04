import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'currency-exchange-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent {
  @Input() label: string;
  @Input() uid: string;
}
