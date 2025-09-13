import { useBeforeUnload } from 'react-router-dom';
import styled from 'styled-components';
import FullScreenMessage from '../../components/FullScreenMessage';
import { LoadingMessages, MESSAGE_UNSAVED_CHANGES } from '../../constant';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useAppSelector } from '../../store';
import { useIframeConnection } from './hooks/useIframeConnection';

/**
 * Constants
 */

const IFRAME_SRC = '/iframe/iframe.html';
const IFRAME_TITLE = 'Site Preview';

/**
 * Component definition
 */

export default function Canvas({ isPreview }: { isPreview: boolean }) {
  const loading = useAppSelector((state) => state.editor.loading);
  const storing = useAppSelector((state) => state.editor.storing);

  useNetworkStatus();
  useIframeConnection();

  useBeforeUnload((event) => {
    if (storing && !isPreview) {
      event.preventDefault();
      event.returnValue = MESSAGE_UNSAVED_CHANGES;
    }
  });

  return (
    <StyledCanvas id='canvas'>
      <iframe src={IFRAME_SRC} title={IFRAME_TITLE} />
      {loading && (
        <>
          <title>{LoadingMessages.Editor}</title>
          <FullScreenMessage mode='loading' message={LoadingMessages.Editor} />
        </>
      )}
    </StyledCanvas>
  );
}

/**
 * Styles
 */

const StyledCanvas = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-black-light);
  overflow: auto;

  iframe {
    transform: translateZ(0);
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform;
    border: none;
    width: 100%;
    height: 100vh;
    overflow: auto;
  }
`;
