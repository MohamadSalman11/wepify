import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setHeight, setWidth, updateElement } from './slices/pageSlice';
import { selectElement } from './slices/selectionSlice';

const StyledCanvas = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  overflow-y: auto;
  overflow-x: hidden;

  iframe {
    border: none;
    background-color: var(--color-white);
  }
`;

function Canvas() {
  const { width, height, scale, elements } = useSelector((state) => state.page);
  const selection = useSelector((state) => state.selection.selectedElement);
  const dispatch = useDispatch();
  const canvasRef = useRef();
  const iframeRef = useRef();
  const isDragging = useRef(false);

  useEffect(() => {
    if (!iframeRef.current || !selection || !selection.id || isDragging.current) return;

    iframeRef.current.contentWindow?.postMessage(
      {
        type: 'SELECTION_UPDATED',
        element: selection
      },
      '*'
    );
  }, [selection]);

  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data;

      if (data?.type === 'DRAG_START') {
        isDragging.current = true;
      }

      if (data?.type === 'DRAG_END') {
        isDragging.current = false;
      }

      if (data?.type === 'UPDATE_POSITION') {
        const { id, left, top } = data;

        dispatch(updateElement({ id: selection.id, updates: { x: left, y: top } }));
        const updatedElement = elements.find((el) => el.id === id);
        dispatch(selectElement(updatedElement));
      }

      if (data?.type === 'SELECT_ELEMENT') {
        const element = elements.find((el) => el.id === data.id);
        dispatch(selectElement(element));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [dispatch, selection, elements]);

  const handleIframeLoad = () => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc) return;

    const root = iframeDoc.getElementById('root');
    if (!root) return;

    root.innerHTML = '';
    elements.forEach((el) => {
      const elNode = iframeDoc.createElement(el.tag);
      elNode.id = el.id;
      elNode.className = 'target ' + generateTailwindClasses(el);
      elNode.innerHTML = el.content || '';
      root.appendChild(elNode);
    });

    iframeRef.current.contentWindow?.postMessage({ type: 'ELEMENTS_READY' }, '*');
    setPageSize();
  };

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
        src='/iframe.html'
        title='Site Preview'
        onLoad={handleIframeLoad}
        style={{
          width: width !== undefined ? `${width}px` : '100%',
          height: height !== undefined ? `${height}px` : '100vh',
          transform: `scale(${scale / 100})`
        }}
      />
    </StyledCanvas>
  );
}

function generateTailwindClasses(el) {
  const widthClass = el.width ? `w-[${el.width}px]` : '';
  const heightClass = el.height ? `h-[${el.height}px]` : '';
  const x = el.x !== undefined ? `left-[${el.x}px]` : '';
  const y = el.y !== undefined ? `top-[${el.y}px]` : '';
  const position = el.x !== undefined || el.y !== undefined ? 'absolute' : '';
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
