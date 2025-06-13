import styled from 'styled-components';

/**
 * Styles
 */

const StyledLogo = styled.img`
  border-radius: var(--border-radius-full);
  width: 5rem;
  height: 5rem;
  margin-bottom: 1.4rem;
`;

/**
 * Component definition
 */

function Logo() {
  return <StyledLogo src='/logo.png' alt='logo' />;
}

export default Logo;
