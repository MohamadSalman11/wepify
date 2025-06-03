import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setHeight, setWidth } from './slices/pageSlice';

const StyledCanvas = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  overflow-y: auto;

  iframe {
    border: none;
    background-color: var(--color-white);
  }
`;

function Canvas() {
  const { width, height, elements } = useSelector((state) => state.page);
  const dispatch = useDispatch();
  const canvasRef = useRef();
  const iframeRef = useRef();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const elementsHtml = elements
      .map((el) => {
        const classList = generateTailwindClasses(el);
        return `<${el.tag} id="${el.id}" class="${classList}">${el.content || ''}</${el.tag}>`;
      })
      .join('\n');

    iframeRef.current.srcdoc = `
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
          <style>
            *{box-sizing: border-box; margin: 0; padding: 0};
            html::-webkit-scrollbar { display: none; };
            html { scrollbar-width: none; margin: 0; padding: 0; overflow-y: auto; };
          </style>
        </head>
        <body>${elementsHtml}</body>
      </html>
    `;

    hasInitialized.current = true;
  }, [elements]);

  // Update element classes
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    elements.forEach((el) => {
      const elNode = doc.getElementById(el.id);
      if (elNode) elNode.className = generateTailwindClasses(el);
    });
  }, [elements]);

  const setPageSize = () => {
    const el = canvasRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    dispatch(setWidth(Math.round(rect.width)));
    dispatch(setHeight(Math.round(rect.height)));
  };

  useEffect(() => {
    setPageSize();
    window.addEventListener('resize', setPageSize);
    return () => window.removeEventListener('resize', setPageSize);
  }, [dispatch]);

  return (
    <StyledCanvas ref={canvasRef}>
      <iframe
        ref={iframeRef}
        title='Site Preview'
        onLoad={setPageSize}
        style={{
          width: width !== undefined ? `${width}px` : '100%',
          height: height !== undefined ? `${height}px` : '100vh'
        }}
      />
    </StyledCanvas>
  );
}

function generateTailwindClasses(el) {
  const widthClass = el.width ? `w-[${el.width}px]` : '';
  const heightClass = el.height ? `h-[${el.height}px]` : '';
  const x = el.x ? `left-[${el.x}px]` : '';
  const y = el.y ? `top-[${el.y}px]` : '';
  const position = x || y ? 'absolute' : '';
  const backgroundColor = el.backgroundColor ? `bg-[${el.backgroundColor}]` : '';
  const color = el.color ? `text-[${el.color}]` : '';
  const fontFamily = el.fontFamily ? `font-[${el.fontFamily}]` : '';
  const fontWeight = el.fontWeight ? `font-[${el.fontWeight}]` : '';
  const fontSize = el.fontSize ? `text-[${el.fontSize}px]` : '';

  let borderClass = '';
  if (el.borderWidth && el.borderColor) {
    const color = el.borderColor;
    const width = el.borderWidth;
    const style = el.borderStyle || 'solid';

    switch (el.borderPosition) {
      case 'top':
        borderClass = `border-t-[${width}px] border-t-[${color}] border-t-${style}`;
        break;
      case 'bottom':
        borderClass = `border-b-[${width}px] border-b-[${color}] border-b-${style}`;
        break;
      case 'left':
        borderClass = `border-l-[${width}px] border-l-[${color}] border-l-${style}`;
        break;
      case 'right':
        borderClass = `border-r-[${width}px] border-r-[${color}] border-r-${style}`;
        break;
      case 'all':
      default:
        borderClass = `border-[${width}px] border-[${color}] border-${style}`;
        break;
    }
  }

  return [
    widthClass,
    heightClass,
    x,
    y,
    position,
    color,
    backgroundColor,
    borderClass,
    fontFamily,
    fontWeight,
    fontSize
  ]
    .filter(Boolean)
    .join(' ');
}

export default Canvas;
