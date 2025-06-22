import { OPTIONS_FONT } from '../../src/features/editor/panels/settingsPanel/TypographySettings';

const removeFonts = (url, fontsToRemove) => {
  if (!fontsToRemove.length) return url;

  const escapedFonts = fontsToRemove.map((font) => font.replace(/ /g, '\\+')).join('|');
  const pattern = new RegExp(`(&?family=(${escapedFonts})(:[^&]*)?)(?=&|$)`, 'g');

  let result = url.replace(pattern, '');

  result = result.replace(/[&]{2,}/g, '&');
  result = result.replace(/\?&/, '?');
  result = result.replace(/&$/, '');

  return result;
};

const getUsedFonts = () => {
  const fonts = new Set();

  document.querySelectorAll('*').forEach((el) => {
    const style = getComputedStyle(el);
    if (style.fontFamily) {
      style.fontFamily.split(',').forEach((f) => {
        const clean = f.trim().replace(/^['"]+|['"]+$/g, '');
        if (clean) fonts.add(clean);
      });
    }
  });

  return fonts;
};

export const cleanUpHTML = async (html) => {
  const usedFonts = getUsedFonts();
  const unusedFonts = OPTIONS_FONT.filter((font) => !usedFonts.has(font));

  let fontsURL = `https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Oswald:wght@200..700&family=Pacifico&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,800&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto+Slab:wght@100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Savate:ital,wght@0,200..900;1,200..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap`;

  fontsURL = removeFonts(fontsURL, unusedFonts);

  const cleanedHTML = html
    .replace(/<script\s+type="module"[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<script\s+type="module"[^>]*\/>/g, '')
    .replace(
      /<link[^>]+href="https:\/\/fonts\.googleapis\.com\/css2[^"]+"[^>]*>/,
      `<link href="${fontsURL}" rel="stylesheet">`
    )
    .replace(/class="([^"]*)"/g, (match, classes) => {
      const filtered = classes
        .split(/\s+/)
        .filter((cls) => cls !== 'target')
        .join(' ');
      return filtered ? `class="${filtered}"` : '';
    })
    .replace(/<link\s+rel=["']stylesheet["']\s+href=["']\.\/iframe\.css["']\s*\/?>/g, '')
    .replace(/\scontenteditable=["'][^"']*["']/g, '')
    .replace(/<style[^>]*data-styled-id="rCS1w3zcxh"[^>]*>[\s\S]*?<\/style>/gi, '');

  const options = {
    parser: 'html',
    printWidth: 80,
    plugins: prettierPlugins
  };

  return await prettier.format(cleanedHTML, options);
};

export const minifyHTML = async (html) => {
  const cleaned = await cleanUpHTML(html);

  return cleaned
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\n/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/style="([^"]*)"/g, (match, css) => {
      const minifiedCss = css
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        .trim();
      return `style="${minifiedCss}"`;
    })
    .trim();
};
