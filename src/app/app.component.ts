import { Component, ViewContainerRef } from '@angular/core';
import { ContentsComponent } from './contents/contents.component';
import { ModalFormService } from './modal-form/modal-form.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContentsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private vcr: ViewContainerRef,
    private formService: ModalFormService
  ) {}
  ngAfterViewInit() {
    this.formService.setViewContainerRef(this.vcr);
  }
}
