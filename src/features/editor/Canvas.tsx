import styled from 'styled-components';
import LoadingScreen from '../../components/LoadingScreen';
import { LoadingMessages } from '../../constant';
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

export default function Canvas() {
  const loading = useAppSelector((state) => state.editor.loading);

  useNetworkStatus();
  useIframeConnection();

  return (
    <StyledCanvas id='canvas'>
      <iframe src={IFRAME_SRC} title={IFRAME_TITLE} />
      {loading && (
        <>
          <title>{LoadingMessages.Editor}</title>
          <LoadingScreen text={LoadingMessages.Editor} />
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
