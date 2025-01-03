import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Content } from '../contents.component';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '../../button/button.component';
import { BreakFormatterPipe } from '../../pipes/break-formatter.pipe';
import { RangePipe } from '../../pipes/range.pipe';

@Component({
  selector: 'app-content-card',
  standalone: true,
  imports: [ButtonComponent, BreakFormatterPipe, RangePipe],
  templateUrl: './content-card.component.html',
  styleUrl: './content-card.component.scss',
})
export class ContentCardComponent {
  @Input() content!: Content;
  @Input() selected: boolean = false;

  constructor(public elementRef: ElementRef<HTMLElement>) {}

  public get ParticipantColor(): 'text-red' | 'text-yellow' | 'text-green' {
    const contentFilledRatio = this.content.maxParticipants / 20;

    if (contentFilledRatio == 1) {
      return 'text-red';
    }
    if (contentFilledRatio >= 0.8) {
      return 'text-yellow';
    }
    return 'text-green';
  }

  @Output() closed = new EventEmitter<void>();
  onCloseClick(event: MouseEvent) {
    event.stopPropagation();
    this.closed.emit();
  }

  @Output() edit = new EventEmitter<void>();
  onEditClick(event: MouseEvent) {
    event.stopPropagation();
    this.edit.emit();
  }

  @Output() delete = new EventEmitter<void>();
  onDeleteClick(event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit();
  }
}
