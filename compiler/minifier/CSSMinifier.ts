import { minify } from 'csso';

/**
 * Class definition
 */

export class CSSMinifier {
  constructor(private css: string) {}

  minify() {
    return minify(this.css).css;
  }
}
