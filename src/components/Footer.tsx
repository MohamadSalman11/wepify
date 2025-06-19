import styled from 'styled-components';

const StyledFooter = styled.footer`
  width: 100%;
  padding: 2rem 0;
  margin-top: 6rem;
  background-color: var(--color-white-1);
  color: var(--color-text-dark);
  text-align: center;
  font-size: 1.4rem;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
  border-top: 1px solid var(--color-gray-light);
`;

function Footer() {
  return <StyledFooter>&copy; {new Date().getFullYear()} Wepify. All rights reserved.</StyledFooter>;
}

export default Footer;
