import { DomTreeBuilder } from '@compiler/dom/DomTreeBuilder';
import { HTMLMinifier } from '@compiler/minifier/HTMLMinifier';
import { CSSGenerator } from '@compiler/style/CSSGenerator';
import { buildHtmlTemplate } from '@compiler/utils/buildHtmlTemplate';
import styleCSS from '@iframe/style.css?raw';
import { PageMetadata } from '@shared/typing';
import { generateFileNameFromPageName } from '@shared/utils';
import { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import { EditorPath, Path } from '../../constant';
import { useAppSelector } from '../../store';
import { buildPath } from '../../utils/buildPath';
import { selectPagesMetadata } from './editorSlice';

/**
 * Constants
 */

const SELECTOR_ANCHOR = 'a';
const LINK_TARGET = '_blank';
const LINK_TARGET_OPTIONS = 'noopener,noreferrer';

const KEY_CLOSE_PREVIEW = 'Escape';
const SCREEN_SIZE_INSTRUCTIONS = 'Press F12 (or Cmd+Option+I on Mac) to preview this page on different screen sizes.';

/**
 * Component definition
 */

export default function Preview() {
  const navigate = useNavigate();
  const { siteId, pageId } = useParams();
  const pagesMetadata = useAppSelector(selectPagesMetadata);
  const page = useAppSelector((state) => state.editor.currentSite?.pages[pageId || '']);
  const [htmlString, setHtmlString] = useState<string>('');
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!page?.elements) {
      return;
    }

    const generateHtml = async () => {
      const domTreeBuilder = new DomTreeBuilder(Object.values(page.elements));
      const cssGenerator = new CSSGenerator({ [page.id]: page });

      const bodyContent = domTreeBuilder.domTree.map((el) => el.outerHTML).join('');
      const pageCssMap = cssGenerator.buildPageCssMap();
      const { normalCSS, mediaCSS } = pageCssMap[page.id];

      const fullHTML = buildHtmlTemplate({ title: page.title, bodyContent, style: [styleCSS, normalCSS, mediaCSS] });
      const htmlMinifier = new HTMLMinifier(fullHTML);
      const cleanedHTML = await htmlMinifier.cleanUp();

      setHtmlString(cleanedHTML);
    };

    generateHtml();
  }, [page]);

  useEffect(() => {
    if (!htmlString) {
      return;
    }

    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    setIframeUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [htmlString]);

  const handleIframeLoad = (iframe: HTMLIFrameElement | null) => {
    const doc = iframe?.contentDocument;
    doc?.addEventListener('click', createLinkHandler(pagesMetadata, navigate, siteId!));
  };

  return (
    <>
      <ButtonContainer>
        <title>{page?.title}</title>
        <StyledButton onClick={() => alert(SCREEN_SIZE_INSTRUCTIONS)}>Preview on Screen Sizes</StyledButton>
        <StyledButton variation='danger' onClick={() => {}}>
          Close Preview
        </StyledButton>
      </ButtonContainer>
      {htmlString && (
        <IframePreview
          src={iframeUrl || ''}
          title='HTML Preview'
          onLoad={(event) => handleIframeLoad(event.target as HTMLIFrameElement)}
        />
      )}
    </>
  );
}

const createLinkHandler =
  (pagesMetadata: PageMetadata[], navigate: NavigateFunction, siteId: string) => (event: MouseEvent) => {
    const href = (event.target as HTMLElement)?.closest(SELECTOR_ANCHOR)?.getAttribute('href');

    if (!href) {
      return;
    }

    event.preventDefault();

    const cleanedHref = href.replace(/^\.?\//, '');
    const targetPage = pagesMetadata.find(
      (p) => generateFileNameFromPageName(p.isIndex ? 'index' : p.name) === cleanedHref
    );

    if (targetPage) {
      navigate(`${buildPath(Path.Editor, { siteId, pageId: targetPage.id })}${EditorPath.Preview}`);
    } else {
      window.open(href, LINK_TARGET, LINK_TARGET_OPTIONS);
    }
  };

/**
 * Styles
 */

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 2%;
  left: 1%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.2rem;
  z-index: var(--zindex-preview-close-button);
`;

const StyledButton = styled(Button).attrs({
  size: 'sm',
  pill: true
})`
  box-shadow: var(--box-shadow-2);
`;

const IframePreview = styled.iframe`
  width: 100%;
  height: 100vh;
  border: none;
  margin-top: 0;
  padding: 0;
`;
