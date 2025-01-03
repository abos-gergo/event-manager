import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ModalFormComponent } from './modal-form.component';
import { Subscription } from 'rxjs';
import { Content } from '../contents/contents.component';

@Injectable({
  providedIn: 'root',
})
export class ModalFormService {
  // Reference of the active modal component.
  // Limited to one modal form currently.
  private modalComponentRef?: ComponentRef<ModalFormComponent>;

  // Gets called at the initialization of the app.
  // The ViewContainerRef will correspond to AppComponent.
  private vcr!: ViewContainerRef;
  private content: Content = {
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    maxParticipants: 0,
  };
  setViewContainerRef(vcr: ViewContainerRef) {
    this.vcr = vcr;
  }

  createContentFormGroup: (FieldOptions | FieldOptions[])[] = [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      placeholder: 'Title of your content',
      validators: Validators.required,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      placeholder: 'Short description',
    },
    [
      {
        name: 'startTime',
        type: 'time',
        label: 'Start Time',
        validators: Validators.required,
      },
      {
        name: 'startDate',
        type: 'date',
        label: 'Start Date',
        validators: Validators.required,
      },
    ],
    {
      name: 'maxParticipants',
      type: 'number',
      label: 'Maximum Participants',
      placeholder: '',
      validators: Validators.required,
    },
  ];

  createForm(
    fnOnSubmit: (arg0: Content) => void,
    content: Content | undefined = undefined
  ): Subscription {
    // Close the previous modal window if there is one
    if (this.modalComponentRef) {
      this.modalComponentRef?.destroy();
      this.modalComponentRef = undefined;
    }

    content && (this.content = content);

    this.modalComponentRef = this.vcr?.createComponent(ModalFormComponent);
    const formGroup = this.generateFormGroup(content);

    const formComponentInstance = this.modalComponentRef.instance;
    formComponentInstance.title = 'Create new content';
    formComponentInstance.formGroup = formGroup;
    formComponentInstance.formFields = this.createContentFormGroup;
    formComponentInstance.blockPage = true;
    this.subscribeToCloseEvent(formComponentInstance);
    return this.subscribeToSubmitEvent(formComponentInstance, fnOnSubmit);
  }

  private generateFormGroup(
    content: Content | undefined = undefined
  ): FormGroup {
    const formGroup = new FormGroup({});
    const flattenedFields = this.createContentFormGroup.flat();

    flattenedFields.forEach((field) => {
      formGroup.addControl(
        field.name,
        new FormControl(
          content ? content[field.name as keyof Content] : '',
          field.validators || []
        )
      );
    });

    return formGroup;
  }

  private subscribeToSubmitEvent(
    formComponentInstance: ModalFormComponent,
    fnOnSubmit: (arg0: Content) => void
  ): Subscription {
    const submitEventSubscription = formComponentInstance.submitEvent.subscribe(
      (formGroup) => {
        this.content.title = formGroup.get('title')?.value as string;
        this.content.description = formGroup.get('description')
          ?.value as string;
        this.content.startTime = formGroup.get('startTime')?.value as string;
        this.content.startDate = formGroup.get('startDate')?.value as string;
        this.content.maxParticipants = formGroup.get('maxParticipants')
          ?.value as number;
        fnOnSubmit(this.content);
        this.modalComponentRef?.destroy();
        this.modalComponentRef = undefined;
        submitEventSubscription.unsubscribe();
      }
    );
    return submitEventSubscription;
  }

  private subscribeToCloseEvent(formComponentInstance: ModalFormComponent) {
    const closeEventSubscription = formComponentInstance.closeEvent.subscribe(
      () => {
        this.modalComponentRef?.destroy();
        this.modalComponentRef = undefined;
        closeEventSubscription.unsubscribe();
      }
    );
  }
}

export interface FieldOptions {
  name: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'time';
  // Default: Field name
  label?: string;
  // Default: Empty string
  placeholder?: string;
  value?: any;
  // Default: Empty array
  validators?: ValidatorFn | ValidatorFn[];
}
