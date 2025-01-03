import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({
  name: "breakFormatter",
  standalone: true,
})
export class BreakFormatterPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    const formatted = value.replaceAll("\n", " <br> ");
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
}
