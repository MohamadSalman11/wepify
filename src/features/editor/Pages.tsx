import { LuPencil, LuSquareMenu, LuTrash } from 'react-icons/lu';
import styled from 'styled-components';

const PagesContainer = styled.div`
  border-right: var(--border-base);
  background-color: var(--color-black-light-2);
  overflow-y: auto;
  padding: 3.2rem 2.4rem;

  button {
    transition: var(--transition-base);
    border-radius: 8px;
    background-color: var(--color-primary);
    width: 100%;
    height: 4.5rem;
    color: var(--color-white);
    font-size: 1.4rem;

    &:hover {
      background-color: var(--color-primary-light);
    }
  }

  ul {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
    margin-top: 2.4rem;
    list-style: none;

    li {
      display: flex;
      position: relative;
      column-gap: 1.2rem;
      align-items: center;
      cursor: pointer;
      border-radius: var(--border-radius-md);
      background-color: var(--color-gray-dark);
      padding: 1.2rem;
      width: 100%;
      overflow: hidden;

      &:hover div {
        transform: translateY(0);
      }

      div {
        display: flex;
        position: absolute;
        top: 10%;
        left: 5%;
        justify-content: space-between;
        transform: translateY(-4rem);
        transition: var(--transition-base);
        width: 90%;

        span {
          border-radius: var(--border-radius-sm);
          background-color: var(--color-gray-dark-2);
          padding: 0.4rem 0.4rem 0.2rem 0.4rem;
        }
      }
    }
  }
`;

const pages = [
  {
    title: 'About me'
  },

  {
    title: 'Contactcccccc'
  }
];

function Pages() {
  return (
    <PagesContainer>
      <button>Add New Site</button>

      <ul>
        {pages.map((page) => (
          <li>
            <LuSquareMenu />
            <span>{page.title.length > 10 ? `${page.title.slice(0, 10)}...` : page.title}</span>
            <div>
              <span>
                <LuPencil />
              </span>
              <span>
                <LuTrash />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </PagesContainer>
  );
}

export default Pages;
