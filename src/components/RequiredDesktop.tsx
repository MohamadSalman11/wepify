import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Breakpoint, Path } from '../constant';
import Button from './Button';

/**
 * Constants
 */

const DEFAULT_MIN_WIDTH = 1280;

/**
 * Types
 */

interface RequireDesktopProps {
  children: ReactNode;
  minWidth?: number;
}

/**
 * Component definition
 */

export default function RequireDesktop({ children, minWidth = DEFAULT_MIN_WIDTH }: RequireDesktopProps) {
  const [isSupported, setIsSupported] = useState(window.innerWidth >= minWidth);
  const location = useLocation();
  const isPreview = location.pathname.endsWith('/preview');

  useEffect(() => {
    const handleResize = () => {
      setIsSupported(window.innerWidth >= minWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [minWidth]);

  if (!isSupported && !isPreview)
    return createPortal(
      <StyledUnsupportedDevice>
        <Content>
          <Headline>Device Not Supported</Headline>
          <Message>Please visit Wepify from a desktop device to experience the full power of creation.</Message>
          <Button asLink href={Path.Home}>
            Back to home
          </Button>
        </Content>
      </StyledUnsupportedDevice>,
      document.body
    );

  return <>{children}</>;
}

/**
 * Styles
 */

const StyledUnsupportedDevice = styled.div`
  position: fixed;
  inset: 0;
  background: var(--color-white-2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.6rem;
  z-index: var(--zindex-required-desktop);
  text-align: center;
`;

const Content = styled.div`
  max-width: 60rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 2.4rem;

  button {
    margin-top: 2.4rem;
  }
`;

const Headline = styled.h1`
  font-size: 5.2rem;
  font-weight: var(--font-weight-regular);

  @media (max-width: ${Breakpoint.Phone}em) {
    font-size: 4.4rem;
  }
`;

const Message = styled.p`
  font-size: 1.6rem;

  @media (max-width: ${Breakpoint.Phone}em) {
    font-size: 1.4rem;
  }
`;
