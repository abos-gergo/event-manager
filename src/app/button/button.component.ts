import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() text: string | null = null;
  @Input() color: 'red' | 'green' | 'blue' | 'yellow' | 'gray' = 'gray';
  @Input() icon: string | null = null;
  @Input() class: string = '';
}
