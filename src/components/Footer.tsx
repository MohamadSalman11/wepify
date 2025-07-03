import styled from 'styled-components';

/**
 * Component definition
 */

export default function Footer() {
  return <StyledFooter>&copy; {new Date().getFullYear()} Wepify. All rights reserved.</StyledFooter>;
}

/**
 * Styles
 */

const StyledFooter = styled.footer`
  width: 100%;
  padding: 2.4rem;
  margin-top: 6.4rem;
  background-color: var(--color-white);
  text-align: center;
  font-size: 1.4rem;
  box-shadow: var(--box-shadow);
  border-top: 1px solid var(--color-gray-light);
`;
