import styled from 'styled-components';

const StyledLogo = styled.img`
  border-radius: var(--border-radius-full);
  width: 5rem;
  height: 5rem;
`;

function Logo() {
  return <StyledLogo src='/logo.png' alt='logo' />;
}

export default Logo;
