import { Component, EventEmitter, Input } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { FieldOptions } from './modal-form.service';

@Component({
  selector: 'app-modal-window',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss'],
})
export class ModalFormComponent {
  @Input() title: string | undefined;
  @Input() formFields!: (FieldOptions | FieldOptions[])[];
  @Input() formGroup!: FormGroup;
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() left: string = '50%';
  @Input() top: string = '50vh';
  @Input() blockPage: boolean = false;
  Array = Array;
  console = console;

  // Closing is handled by the ModalFormService
  closeEvent: EventEmitter<void> = new EventEmitter();
  close() {
    this.closeEvent.emit();
  }

  submitEvent: EventEmitter<FormGroup> = new EventEmitter();
  submit() {
    if (this.formGroup.invalid) {
      alert(
        'Form is invalid.\nTODO: Replace this alert with errors below the fields'
      );
      return;
    }
    this.submitEvent.emit(this.formGroup);
  }

  protected hasRequiredValidator(
    validators: ValidatorFn | ValidatorFn[]
  ): boolean {
    const validatorArray = Array.isArray(validators)
      ? validators
      : [validators];
    return validatorArray.some(
      (validator) => validator === Validators.required
    );
  }
}
