import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useAppSelector } from '../../store';
import { useCanvasSync } from './hooks/useCanvasSync';
import { setHeight, setWidth } from './slices/pageSlice';
import { selectElement } from './slices/selectionSlice';

/**
 * Styles
 */

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
  }
`;

/**
 * Component definition
 */

function Canvas() {
  const { width, height, scale, elements } = useAppSelector((state) => state.page);

  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useCanvasSync(iframeRef);

  const handleIframeLoad = () => {
    const firstSection = elements[0];

    if (canvasRef.current) {
      dispatch(selectElement(firstSection));
      dispatch(setWidth(canvasRef.current.clientWidth));
      dispatch(setHeight(canvasRef.current.clientHeight));
    }
  };

  return (
    <StyledCanvas ref={canvasRef}>
      <iframe
        ref={iframeRef}
        src='/iframe/iframe.html'
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
