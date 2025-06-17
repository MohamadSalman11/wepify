import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { LuCalendar, LuChevronDown, LuFileStack, LuHardDrive, LuSearch } from 'react-icons/lu';
import styled from 'styled-components';
import Dropdown from '../../../components/Dropdown';
import Icon from '../../../components/Icon';

/**
 * Styles
 */

const StyledSearchBox = styled.div`
  margin: 1.2rem auto;
  width: fit-content;
  text-align: center;

  h1 {
    font-weight: 400;
    font-size: 2.2rem;
  }

  & > ul {
    display: flex;
    column-gap: 2.4rem;
    justify-content: center;
    align-items: center;
    margin-top: 1.6rem;

    & > li {
      position: relative;

      & > span {
        display: flex;
        column-gap: 0.8rem;
        justify-content: center;
        align-items: center;
        transition: var(--transition-base);
        cursor: pointer;
        border-radius: var(--border-radius-full);
        background-color: var(--color-gray-light-3);
        padding: 0.8rem 1.2rem;
        font-size: 1.2rem;

        &:hover {
          background-color: var(--color-gray-light-2);
        }

        svg:nth-child(1) {
          font-size: 1.8rem;
        }
      }
    }
  }
`;

const Searchbar = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 2.4rem;

  input {
    border-radius: var(--border-radius-full);
    background-color: var(--color-white-2);
    padding: 1.6rem 1.6rem 1.6rem 6.4rem;
    width: 80rem;
    font-size: 1.6rem;
  }

  svg {
    position: absolute;
    left: 3%;
    font-size: 2rem;
  }
`;

/**
 * Component definition
 */

export default function SearchBox() {
  return (
    <StyledSearchBox>
      <h1>Welcome to Wepify</h1>
      <Searchbar>
        <LuSearch />
        <input type='text' placeholder='Search in Wepify' />
      </Searchbar>
      <FilterList />
    </StyledSearchBox>
  );
}

function FilterList() {
  return (
    <ul>
      <FilterItem title='Size' icon={LuHardDrive}>
        <li>{'<'} 500 KB</li>
        <li>500 KB - 1 MB</li>
        <li>1 MB - 5 MB</li>
        <li>5 MB - 10 MB</li>
        <li>{'>'} 10 MB</li>
      </FilterItem>
      <FilterItem title='Pages' icon={LuFileStack}>
        <li>1 - 3 pages</li>
        <li>4 - 10 pages</li>
        <li>11 - 25 pages</li>
        <li>26 - 50 pages</li>
        <li>{'>'} 50 pages</li>
      </FilterItem>
      <FilterItem title='Modified' icon={LuCalendar}>
        <li>Today</li>
        <li>Last 7 days</li>
        <li>Last 30 days</li>
        <li>Last 60 days</li>
        <li>Last 90 days</li>
      </FilterItem>
    </ul>
  );
}

function FilterItem({ children, title, icon }: { children: ReactNode; title: string; icon: IconType }) {
  return (
    <li>
      <Dropdown>
        <Dropdown.open>
          <span>
            <Icon icon={icon} />
            {title}
            <LuChevronDown />
          </span>
        </Dropdown.open>
        <Dropdown.drop>{children}</Dropdown.drop>
      </Dropdown>
    </li>
  );
}
