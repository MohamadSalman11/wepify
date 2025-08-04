import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { LoadingMessages } from '../constant';
import Button from './Button';
import Logo from './Logo';

/**
 * Types
 */

interface LoadingScreenProps {
  text?: string;
  buttonText?: string;
  handler?: () => void;
}

/**
 * Component definition
 */

export default function LoadingScreen({ text = LoadingMessages.Dashboard, buttonText, handler }: LoadingScreenProps) {
  return createPortal(
    <StyledLoadingScreen>
      <LogoWrapper>
        <Logo />
        Wepify
      </LogoWrapper>
      <LoadingBarWrapper>
        <LoadingBar />
      </LoadingBarWrapper>
      <LoadingText>{text}</LoadingText>
      {buttonText && (
        <Button onClick={handler} size='sm'>
          Back to dashboard
        </Button>
      )}
    </StyledLoadingScreen>,
    document.body
  );
}

/**
 * Styles
 */

const StyledLoadingScreen = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  background-color: var(--color-white-2);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 2.4rem;
  z-index: var(--zindex-loading-screen);
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.2rem;
  font-size: 3rem;
  color: var(--color-primary);

  img {
    margin-bottom: 0.4rem;
  }
`;

const indeterminate = keyframes`
  0% {
    left: -40%;
    right: 100%;
  }
  50% {
    left: 25%;
    right: 0%;
  }
  100% {
    left: 100%;
    right: -40%;
  }
`;

const LoadingBarWrapper = styled.div`
  position: relative;
  width: 35rem;
  height: 0.8rem;
  background-color: var(--color-gray-light-2);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
`;

const LoadingBar = styled.div`
  position: absolute;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  height: 100%;
  border-radius: var(--border-radius-lg);
  animation: ${indeterminate} 1.5s infinite linear;
`;

const LoadingText = styled.p`
  font-size: 1.4rem;
  font-weight: 300;
`;
