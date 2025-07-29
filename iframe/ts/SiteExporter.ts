import { Site, SitePage } from '@shared/types';
import JSZip from 'jszip';
import cssFile from '../style.css?raw';
import { generateCssFiles } from './compiler/generateCSSFile';
import { minifyCSS } from './compiler/minifyCSS';
import { cleanUpHTML, minifyHTML } from './compiler/minifyHTML';
import { downloadBlob } from './utils/downloadBlob';
import { renderElements } from './view';
import favicon from '/favicon.ico';

/**
 * Constants
 */

const SELECTOR_STYLE_LINK = 'link[href="./style.css"]';
const SELECTOR_DATA_IMAGE = 'img[src^="data:image"]';
const SITE_JSON_WARNING = `⚠️ Do NOT modify any fields in this file manually, it will break the application. Upload it and edit in the app`;

const CSS_FILE_INDEX = 'index.css';
const CSS_FILE_RESPONSIVE = 'responsive.css';

enum FileNames {
  IndexPage = 'index.html',
  StyleCSS = 'style.css',
  SiteJson = 'site.json',
  ZipDownload = 'website.zip',
  Favicon = 'favicon.ico'
}

/**
 * Class definition
 */

class SiteExporter {
  private zip: JSZip;
  private imageCount = 0;
  private shouldMinify: boolean;

  constructor(shouldMinify: boolean) {
    this.zip = new JSZip();
    this.shouldMinify = shouldMinify;
  }

  async exportSite(site: Site) {
    const srcFolder = this.zip.folder('src')!;

    const faviconBlob = await fetch(favicon).then((res) => res.blob());
    const faviconArrayBuffer = await faviconBlob.arrayBuffer();

    srcFolder.file(FileNames.Favicon, faviconArrayBuffer);

    this.addCssFiles(site);

    for (const page of site.pages) {
      await this.addPage(page);
    }

    this.zip.file(FileNames.SiteJson, JSON.stringify({ __WARNING__: SITE_JSON_WARNING, ...site }, null, 2));

    const content = await this.zip.generateAsync({ type: 'blob' });
    downloadBlob(content, FileNames.ZipDownload);
  }

  private addCssFiles(site: Site) {
    const folder = this.zip.folder('src')!;

    folder.file(FileNames.StyleCSS, this.shouldMinify ? minifyCSS(cssFile) : cssFile);

    const { indexCss, responsiveCss } = generateCssFiles(site);

    const indexCssFinal = this.shouldMinify ? minifyCSS(indexCss) : indexCss;
    const responsiveCssFinal = this.shouldMinify ? minifyCSS(responsiveCss) : responsiveCss;

    folder.file(CSS_FILE_INDEX, indexCssFinal);
    folder.file(CSS_FILE_RESPONSIVE, responsiveCssFinal);
  }

  private async addPage(page: SitePage) {
    const doc = document.implementation.createHTMLDocument(page.name);
    doc.head.innerHTML = document.head.innerHTML;
    doc.title = page.title || page.name;

    const faviconLink = doc.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.href = './favicon.ico';
    doc.head.append(faviconLink);

    const styleLink = doc.head.querySelector(SELECTOR_STYLE_LINK);
    if (styleLink) {
      const indexLink = doc.createElement('link');
      indexLink.rel = 'stylesheet';
      indexLink.href = `./${CSS_FILE_INDEX}`;
      styleLink.after(indexLink);

      const responsiveLink = doc.createElement('link');
      responsiveLink.rel = 'stylesheet';
      responsiveLink.href = `./${CSS_FILE_RESPONSIVE}`;
      indexLink.after(responsiveLink);
    }

    renderElements({ elements: page.elements, doc });
    this.processImages(doc);

    const html = this.shouldMinify
      ? await minifyHTML(doc.documentElement.outerHTML)
      : await cleanUpHTML(doc.documentElement.outerHTML);

    const fileName = page.isIndex ? FileNames.IndexPage : `${page.name.toLowerCase().replace(/\s+/g, '_')}.html`;

    const folder = this.zip.folder('src')!;
    folder.file(fileName, html);
  }

  private processImages(doc: Document) {
    const images = doc.querySelectorAll(SELECTOR_DATA_IMAGE) as NodeListOf<HTMLImageElement>;

    const imagesFolder = this.zip.folder('src/images')!;

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

export default SiteExporter;
