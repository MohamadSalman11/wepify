import { createDomTreeFromPageElements } from '@compiler/dom/createDomTreeFromPageElements';
import { CSSGenerator } from '@compiler/utils/CSSGenerator';
import { minifyCSS } from '@compiler/utils/minifyCSS';
import { cleanUpHTML, minifyHTML } from '@compiler/utils/minifyHTML';
import iframeConnection from '@shared/iframeConnection';
import { Page, Site } from '@shared/typing';
import JSZip from 'jszip';
import cssFile from '../../style.css?raw';
import { downloadBlob } from '../utils/downloadBlob';
import favicon from '/favicon.ico';

/**
 * Constants
 */

const DEFAULT_IMAGES_COUNT = 0;
const SELECTOR_DATA_IMAGE = 'img[src^="data:image"]';
const SITE_JSON_WARNING = `⚠️ Do NOT modify any fields in this file manually, it will break the application. Upload it and edit in the app`;

enum File {
  IndexPage = 'index.html',
  StyleCSS = 'style.css',
  ResponsiveCSS = 'responsive.css',
  IndexCSS = 'index.css',
  SiteJson = 'site.json',
  ZipDownload = 'website.zip',
  Favicon = 'favicon.ico'
}

enum Folders {
  Root = 'src',
  Images = 'src/images'
}

const DOCUMENT_HEAD_TEMPLATE = `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Iframe Content</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Oswald:wght@200..700&family=Pacifico&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,800&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto+Slab:wght@100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Savate:ital,wght@0,200..900;1,200..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
      rel="stylesheet"
    />
    <link rel="icon" type="image/x-icon" href="${File.Favicon}" />
    <link rel="stylesheet" href="./${File.StyleCSS}" />
`;

/**
 * Class definition
 */

class SiteExportController {
  private zip: JSZip;
  private imageCount = DEFAULT_IMAGES_COUNT;

  constructor(
    private site: Site,
    private shouldMinify: boolean
  ) {
    this.zip = new JSZip();
    this.site = site;
    this.shouldMinify = shouldMinify;
  }

  downloadZip = async () => {
    await this.exportSite();

    iframeConnection.send('SITE_DOWNLOADED');
  };

  private async exportSite() {
    const srcFolder = this.zip.folder(Folders.Root)!;

    const faviconBlob = await fetch(favicon).then((res) => res.blob());
    const faviconArrayBuffer = await faviconBlob.arrayBuffer();

    srcFolder.file(File.Favicon, faviconArrayBuffer);

    this.addCssFiles(this.site);

    for (const page of Object.values(this.site.pages)) {
      await this.addPage(page);
    }

    this.zip.file(File.SiteJson, JSON.stringify({ __WARNING__: SITE_JSON_WARNING, ...this.site }, null, 2));

    const content = await this.zip.generateAsync({ type: 'blob' });
    downloadBlob(content, File.ZipDownload);
  }

  private addCssFiles(site: Site) {
    const folder = this.zip.folder(Folders.Root)!;

    folder.file(File.StyleCSS, this.shouldMinify ? minifyCSS(cssFile) : cssFile);

    const pageCssMap = new CSSGenerator(site.pages).buildPageCssMap();

    for (const [pageId, cssData] of Object.entries(pageCssMap)) {
      const indexCssFinal = this.shouldMinify ? minifyCSS(cssData.normalCSS) : cssData.normalCSS;
      const responsiveCssFinal = this.shouldMinify ? minifyCSS(cssData.mediaCSS) : cssData.mediaCSS;

      folder.file(`${pageId}_index.css`, indexCssFinal);
      folder.file(`${pageId}_responsive.css`, responsiveCssFinal);
    }
  }

  private async addPage(page: Page) {
    const doc = document.implementation.createHTMLDocument(page.name);
    doc.head.innerHTML = DOCUMENT_HEAD_TEMPLATE;
    doc.title = page.title || page.name;
    doc.body.style.backgroundColor = page.backgroundColor;

    const pageCssLinks = `
    <link rel="stylesheet" href="./${page.id}_${File.IndexCSS}" />
    <link rel="stylesheet" href="./${page.id}_${File.ResponsiveCSS}" />
  `;

    doc.head.insertAdjacentHTML('beforeend', pageCssLinks);

    const domTree = createDomTreeFromPageElements(Object.values(page.elements));

    for (const domEl of domTree) {
      doc.body.append(domEl);
    }

    this.processImages(doc);

    const html = this.shouldMinify
      ? await minifyHTML(doc.documentElement.outerHTML)
      : await cleanUpHTML(doc.documentElement.outerHTML);

    const fileName = page.isIndex ? File.IndexPage : `${page.name.toLowerCase().replace(/\s+/g, '_')}.html`;

    const folder = this.zip.folder(Folders.Root)!;
    folder.file(fileName, html);
  }

  private processImages(doc: Document) {
    const images = doc.querySelectorAll(SELECTOR_DATA_IMAGE) as NodeListOf<HTMLImageElement>;

    if (images.length === 0) return;

    const imagesFolder = this.zip.folder(Folders.Images)!;

    for (const img of images) {
      const src = img.src;
      const ext = src.slice(src.indexOf('/') + 1, src.indexOf(';'));
      const base64 = src.split(',')[1];
      const fileName = `image_${++this.imageCount}.${ext}`;

      imagesFolder.file(fileName, base64, { base64: true });
      img.src = `images/${fileName}`;
    }
  }
}

export default SiteExportController;
