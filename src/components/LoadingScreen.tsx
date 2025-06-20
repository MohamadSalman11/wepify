import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { LoadingMessages } from '../constant';
import Logo from './Logo';

const DEFAULT_DURATION = 2000;
const MS_TO_SECONDS = 1000;

/**
 * Styles
 */

const StyledLoadingScreen = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  background: var(--color-white-2);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 24px;
  z-index: 999999;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-primary);

  img {
    margin-bottom: 0.4rem;
  }
`;

const fillAnimation = keyframes`
  0% { width: 0; }
  100% { width: 100%; }
`;

const LoadingBarWrapper = styled.div`
  width: 35rem;
  height: 8px;
  background: var(--color-gray-light-2);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
`;

const LoadingBar = styled.div<{ duration: string }>`
  height: 100%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border-radius: var(--border-radius-lg);
  animation: ${fillAnimation} ${({ duration }) => duration} ease-in-out;
`;

const LoadingText = styled.p`
  font-size: 1.4rem;
  font-weight: 300;
`;

/**
 * Styles
 */

function LoadingScreen({
  loadingText = LoadingMessages.Dashboard,
  duration
}: {
  loadingText?: string;
  duration?: number;
}) {
  const randomDuration = `${(duration ?? DEFAULT_DURATION) / MS_TO_SECONDS}s`;

  return createPortal(
    <StyledLoadingScreen>
      <LogoWrapper>
        <Logo />
        Wepify
      </LogoWrapper>
      <LoadingBarWrapper>
        <LoadingBar duration={randomDuration} />
      </LoadingBarWrapper>
      <LoadingText>{loadingText}...</LoadingText>
    </StyledLoadingScreen>,
    document.body
  );
}

export default LoadingScreen;
