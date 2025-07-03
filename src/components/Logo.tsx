import styled from 'styled-components';

/**
 * Component definition
 */

export default function Logo() {
  return <StyledLogo src='/logo.png' alt='logo' />;
}

/**
 * Styles
 */

const StyledLogo = styled.img`
  border-radius: var(--border-radius-full);
  width: 5rem;
  height: 5rem;
  margin-bottom: 1.4rem;
`;
