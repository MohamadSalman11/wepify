import { DomTreeBuilder } from '@compiler/dom/DomTreeBuilder';
import { CSSMinifier } from '@compiler/minifier/CSSMinifier';
import { HTMLMinifier } from '@compiler/minifier/HTMLMinifier';
import { CSSGenerator } from '@compiler/style/CSSGenerator';
import cssFile from '@iframe/style.css?raw';
import { ElementsName, FONTS_URL } from '@shared/constants';
import { Page, Site } from '@shared/typing';
import JSZip from 'jszip';
import { StorageKey } from './constant';
import { AppStorage } from './utils/appStorage';
import favicon from '/favicon.ico';

/**
 * Constants
 */

const DEFAULT_IMAGES_COUNT = 0;
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
  Images = 'images'
}

const DOCUMENT_HEAD_TEMPLATE = `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Iframe Content</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="${FONTS_URL}"
      rel="stylesheet"
    />
    <link rel="icon" type="image/x-icon" href="${File.Favicon}" />
    <link rel="stylesheet" href="./${File.StyleCSS}" />
`;

/**
 * Class definition
 */

class SiteExporter {
  private zip: JSZip;
  private imageCount = DEFAULT_IMAGES_COUNT;
  private imagesBase64Map: Record<string, string> = {};

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

    this.zip.file(
      File.SiteJson,
      JSON.stringify({ __WARNING__: SITE_JSON_WARNING, ...this.site, images: this.imagesBase64Map }, null, 2)
    );

    const content = await this.zip.generateAsync({ type: 'blob' });
    this.downloadBlob(content, File.ZipDownload);
  }

  private downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement(ElementsName.A);
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  private addCssFiles(site: Site) {
    const folder = this.zip.folder(Folders.Root)!;

    folder.file(File.StyleCSS, this.shouldMinify ? new CSSMinifier(cssFile).minify() : cssFile);

    const pageCssMap = new CSSGenerator(site.pages).buildPageCssMap();

    for (const [pageId, cssData] of Object.entries(pageCssMap)) {
      const indexCssFinal = this.shouldMinify ? new CSSMinifier(cssData.normalCSS).minify() : cssData.normalCSS;
      const responsiveCssFinal = this.shouldMinify ? new CSSMinifier(cssData.mediaCSS).minify() : cssData.mediaCSS;

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

    const domTreeBuilder = new DomTreeBuilder(Object.values(page.elements));

    for (const domEl of domTreeBuilder.domTree) {
      doc.body.append(domEl);
    }

    await this.processImages(doc);

    const htmlMinifier = new HTMLMinifier(doc.documentElement.outerHTML);
    const html = this.shouldMinify ? await htmlMinifier.minify() : await htmlMinifier.cleanUp();

    const fileName = page.isIndex ? File.IndexPage : `${page.name.toLowerCase().replace(/\s+/g, '_')}.html`;
    const folder = this.zip.folder(Folders.Root)!;

    folder.file(fileName, html);
  }

  private async processImages(doc: Document) {
    const imagesMap = await AppStorage.get<Record<string, Blob>>(StorageKey.Images);
    const images = doc.querySelectorAll('img') as NodeListOf<HTMLImageElement>;

    if (images.length === 0) return;

    const imagesFolder = this.zip.folder(`${Folders.Root}/${Folders.Images}`)!;

    for (const img of images) {
      const blobId = img.dataset.blobId;
      if (!blobId) continue;

      const blob = imagesMap[blobId];
      if (!blob) continue;

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.addEventListener('error', reject);
        reader.readAsDataURL(blob);
      });

      const ext = blob.type.split('/')[1] || 'png';
      const fileName = `image_${++this.imageCount}.${ext}`;

      imagesFolder.file(fileName, base64, { base64: true });
      img.src = `./${Folders.Images}/${fileName}`;
      this.imagesBase64Map[blobId] = base64;
    }
  }
}

export default SiteExporter;
