import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useIframeMessaging } from './hooks/use-iframe-messaging';
import { setHeight, setWidth } from './slices/pageSlice';
import { renderElementsToIframe } from './utils/iframe-renderer';

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
  const { width, height, scale, elements } = useSelector((state: any) => state.page);
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useIframeMessaging(iframeRef);

  const handleIframeLoad = () => {
    renderElementsToIframe(elements, iframeRef);

    console.log(canvasRef.current);

    dispatch(setWidth(Math.round(canvasRef.current?.clientWidth)));
    dispatch(setHeight(Math.round(canvasRef.current?.clientHeight)));
  };

  useEffect(() => {
    renderElementsToIframe(elements, iframeRef);
  }, [elements.length]);

  return (
    <StyledCanvas ref={canvasRef}>
      <iframe
        ref={iframeRef}
        src='/iframe.html'
        title='Site Preview'
        onLoad={handleIframeLoad}
        style={{
          width: width === undefined ? '100%' : `${width}px`,
          height: height === undefined ? '100vh' : `${height}px`,
          transform: `scale(${scale / 100})`
        }}
      />
    </StyledCanvas>
  );
}

export default Canvas;
