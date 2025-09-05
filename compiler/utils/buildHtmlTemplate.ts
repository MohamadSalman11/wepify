import { CSSMinifier } from '@compiler/minifier/CSSMinifier';
import { FONTS_URL } from '@shared/constants';

interface HtmlTemplateOptions {
  title?: string;
  bodyContent?: string;
  style?: string[];
}

export const buildHtmlTemplate = ({ title = 'Untitled', bodyContent = '', style = [] }: HtmlTemplateOptions) => {
  const combinedCSS = style.join('\n');
  const minifiedCSS = combinedCSS ? new CSSMinifier(combinedCSS).minify() : '';
  const combinedStyle = minifiedCSS ? `<style>${minifiedCSS}</style>` : '';

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="${FONTS_URL}"
        rel="stylesheet"
      />
      <title>${title}</title>
      ${combinedStyle}
    </head>
    <body>
      ${bodyContent}
    </body>
  </html>
  `;
};
