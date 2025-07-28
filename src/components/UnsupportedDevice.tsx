import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Path } from '../constant';
import Button from './Button';

/**
 * Types
 */

interface UnsupportedDeviceProps {
  headline?: string;
  message?: string;
}

/**
 * Component definition
 */

export default function UnsupportedDevice({
  headline = 'Device Not Supported',
  message = 'Please visit Wepify from a desktop device to experience the full power of creation.'
}: UnsupportedDeviceProps) {
  return createPortal(
    <StyledUnsupportedDevice>
      <Content>
        <Headline>{headline}</Headline>
        <Message>{message}</Message>
        <div>
          <Button asLink href={Path.Home}>
            Back to home
          </Button>
        </div>
      </Content>
    </StyledUnsupportedDevice>,
    document.body
  );
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
  gap: 3.2rem;
  padding: 2.4rem;
  z-index: var(--zindex-loading-screen);
  text-align: center;
`;

const Content = styled.div`
  max-width: 60rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  & > div {
    margin-top: 0.8rem;
  }
`;

const Headline = styled.h1`
  font-size: 4.4rem;
  font-weight: 400;
`;

const Message = styled.p`
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1.6;
`;
