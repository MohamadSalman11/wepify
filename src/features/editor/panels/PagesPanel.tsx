import { LuPencil, LuSquareMenu, LuTrash } from 'react-icons/lu';
import styled from 'styled-components';
import Button from '../../../components/Button';

const PagesList = styled.ul`
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
`;

const pages = [
  {
    title: 'About me'
  },

  {
    title: 'Contactcccccc'
  }
];

function PagesPanel() {
  return (
    <>
      <Button size='full'>Add New Site</Button>

      <PagesList>
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
      </PagesList>
    </>
  );
}

export default PagesPanel;
