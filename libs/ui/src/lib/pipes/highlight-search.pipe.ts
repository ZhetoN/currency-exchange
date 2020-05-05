import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'highlightSearch'})
export class HighlightSearchPipe implements PipeTransform {

  constructor(private readonly domSanitizer: DomSanitizer) {
  }

  transform(value: string, needle: string, cssClass?: string): string | null {
    if (!needle) {
      return value;
    }
    const escapedNeedle = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(${escapedNeedle})`, 'gi');
    const replaceValue = cssClass ? `<span class="${cssClass}">$1</span>` : '<strong>$1</strong>';
    const result = value.replace(re, replaceValue);

    return this.domSanitizer.sanitize(SecurityContext.HTML, result);
  }
}
