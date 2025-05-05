import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';

hljs.registerLanguage('python', python);

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    hljs.highlightElement(this.el.nativeElement);
  }
}
