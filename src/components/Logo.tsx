import styled from 'styled-components';

/**
 * Types
 */

interface LogoProps {
  withText?: boolean;
  onClick?: () => void;
}

/**
 * Component definition
 */

export default function Logo({ withText = false, onClick }: LogoProps) {
  if (withText) {
    return (
      <LogoContainer $clickable={!!onClick} onClick={onClick}>
        <StyledLogo src='/logo.png' alt='logo' />
        <span>Wepify</span>
      </LogoContainer>
    );
  }

  return <StyledLogo src='/logo.png' alt='logo' />;
}

/**
 * Styles
 */

const StyledLogo = styled.img`
  border-radius: var(--border-radius-full);
  width: 4.3rem;
  height: 4.3rem;
`;

const LogoContainer = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  column-gap: 1.2rem;
  font-size: 2.2rem;
  color: var(--color-primary);
  user-select: none;
  font-weight: var(--font-weight-medium);

  ${({ $clickable }) => $clickable && 'cursor: pointer;'}
`;
