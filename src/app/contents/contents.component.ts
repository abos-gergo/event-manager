import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ContentCardComponent } from './content-card/content-card.component';
import { ContentService } from './content.service';
import { Validators } from '@angular/forms';
import {
  FieldOptions,
  ModalFormService,
} from '../modal-form/modal-form.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { isEqual } from 'lodash';

@Component({
  selector: 'app-contents',
  standalone: true,
  imports: [ButtonComponent, ContentCardComponent, CommonModule],
  templateUrl: './contents.component.html',
  styleUrl: './contents.component.scss',
})
export class ContentsComponent {
  constructor(
    protected contentService: ContentService,
    protected formService: ModalFormService,
    private toastr: ToastrService
  ) {}

  contents: Content[] = [];
  async ngOnInit() {
    // Query the contents from the backend
    const getResponse = await this.contentService.get();

    // Default value is empty array
    this.contents = getResponse instanceof HttpErrorResponse ? [] : getResponse;
  }

  //#region Content creation
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

  async deleteContent(content: Content) {
    const deletedContent = await this.contentService.delete(content);

    if (deletedContent instanceof HttpErrorResponse) {
      this.toastr.error(
        'Something went wrong during deleting this content.',
        'Error'
      );
      return;
    }
    this.toastr.success('Successfully deleted content.', 'Success');
    this.resetSelectedContent();
    this.contents = this.contents.filter((c) => {
      return !isEqual(c, deletedContent);
    });
  }

  // This is a callback function that gets called when the create content form gets submitted.
  protected onCreateSubmit = async (content: Content) => {
    const createdContent = await this.contentService.create(content);

    if (createdContent instanceof HttpErrorResponse) {
      this.toastr.error(
        'Something went wrong during creating this content.',
        'Error'
      );
      return;
    }
    this.toastr.success('Successfully created content.', 'Success');
    this.contents.push(createdContent);
  };

  protected onEditSubmit = async (content: Content) => {
    const editedContend = await this.contentService.edit(content);

    if (editedContend instanceof HttpErrorResponse) {
      this.toastr.error(
        'Something went wrong during editing this content.',
        'Error'
      );
      return;
    }
    this.toastr.success('Successfully edited content.', 'Success');
  };
  //#endregion

  //#region Card selection
  selectedContentCard: ContentCardComponent | undefined;
  private selectedCardOriginalPosition: { top: number; left: number } = {
    top: 0,
    left: 0,
  };

  resetSelectedContent() {
    if (!this.selectedContentCard) {
      return;
    }
    const cardHtml = this.selectedContentCard.elementRef.nativeElement;
    cardHtml.style.removeProperty('width');
    cardHtml.style.removeProperty('height');
    cardHtml.style.top = `${this.selectedCardOriginalPosition.top}px`;
    cardHtml.style.left = `${this.selectedCardOriginalPosition.left}px`;

    this.selectedContentCard = undefined;

    setTimeout(() => {
      const parentElement = cardHtml.parentElement as HTMLElement;
      const previousSibling = cardHtml.previousElementSibling as Element;
      parentElement.removeChild(previousSibling);
      cardHtml.style.removeProperty('position');
      cardHtml.style.removeProperty('z-index');
    }, 100);
  }

  setSelectedContent(contentCard: ContentCardComponent) {
    if (this.selectedContentCard) {
      return;
    }

    this.selectedContentCard = contentCard;

    const cardHtml = contentCard.elementRef.nativeElement;
    //Required for element to stay in place when absolute position is applied
    const currentPosition = this.getElementAbsolutePosition(cardHtml);
    this.selectedCardOriginalPosition = currentPosition;

    //Inserting a copy so that everything else stays the same
    const parentElement = cardHtml.parentElement as HTMLElement;
    const copy = cardHtml.cloneNode();
    parentElement.insertBefore(copy, cardHtml);

    //Converting to absolute position so it can be resized later.
    cardHtml.style.position = 'absolute';
    cardHtml.style.top = `${currentPosition.top}px`;
    cardHtml.style.left = `${currentPosition.left}px`;
    cardHtml.style.zIndex = '2';

    //Using a timeout so that a transition is applied.
    //Element would just jump without a timeout
    setTimeout(() => {
      cardHtml.style.left = '10%';
      cardHtml.style.width = '80%';
      cardHtml.style.top = '10vh';
      cardHtml.style.height = '80vh';
    }, 1);
  }

  private getElementAbsolutePosition(element: HTMLElement): {
    top: number;
    left: number;
  } {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
    };
  }
  //#endregion
}

export interface Content {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  maxParticipants: number;
}
