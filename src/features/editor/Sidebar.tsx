import { LuCloudUpload, LuCodeXml, LuFile, LuLayers3, LuLogOut, LuPlus } from 'react-icons/lu';
import styled from 'styled-components';
import Divider from '../../components/divider';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';

const StyledSidebar = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-black-light-2);
  border-right: var(--border-base);
  grid-row: 1 / 3;
  padding: 1.6rem 1.2rem 4.8rem 1.2rem;

  ul {
    display: flex;
    row-gap: 3.2rem;
    flex-direction: column;
    align-items: center;
    margin-top: 2.4rem;
    list-style: none;

    li {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      transition: var(--transition-base);
      cursor: pointer;
      border-radius: var(--border-radius-md);
      width: 4rem;
      height: 4rem;

      &::after {
        position: absolute;
        top: 50%;
        transform: translate(5.45rem, -50%);
        opacity: 0;
        transition: var(--transition-base);
        border-radius: var(--border-radius-md);
        background-color: var(--color-primary);
        width: 3px;
        height: 40px;
        content: '';
      }

      &:hover {
        background-color: var(--color-gray-dark-2);
      }

      &:nth-child(1) {
        background-color: var(--color-gray-dark-2);
        color: var(--color-white);
      }
    }
  }

  & svg:not(nav svg) {
    cursor: pointer;
    margin-top: auto;
    color: var(--color-red);
  }
`;

function Sidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <Divider />
      <nav>
        <ul>
          <li>
            <Icon icon={LuPlus} />
          </li>
          <li>
            <Icon icon={LuFile} />
          </li>
          <li>
            <Icon icon={LuLayers3} />
          </li>
          <li>
            <Icon icon={LuCloudUpload} />
          </li>
          <li>
            <Icon icon={LuCodeXml} />
          </li>
        </ul>
      </nav>
      <Icon icon={LuLogOut} />
    </StyledSidebar>
  );
}

export default Sidebar;
