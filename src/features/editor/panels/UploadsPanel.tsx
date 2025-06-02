import { LuTrash } from 'react-icons/lu';
import styled from 'styled-components';
import Button from '../../../components/Button';

const images = [
  {
    title: 'css.png'
  },
  {
    title: 'css.png'
  },
  {
    title: 'css.png'
  }
];

const Nav = styled.nav`
  ul {
    display: flex;
    align-items: center;
    margin-top: 3.2rem;
    list-style: none;

    li {
      flex-grow: 1;
      cursor: pointer;
      padding: 1.2rem 0;
      text-align: center;

      &:hover {
        box-shadow: 0 2px 0 0 var(--color-primary-light);
      }

      &:hover a {
        color: var(--color-gray);
      }

      a {
        transition: var(--transition-base);
        text-decoration: none;
      }
    }
  }
`;

const Media = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  list-style: none;
  margin-top: 1.6rem;

  li {
    position: relative;
    cursor: pointer;
    border-radius: var(--border-radius-md);
    background-color: var(--color-primary-light);
    width: 100%;
    height: 7rem;
    overflow: hidden;

    &:hover svg {
      transform: translateY(0);
    }

    svg {
      position: absolute;
      top: 8%;
      right: 5%;
      transform: translateY(-4rem);
      transition: var(--transition-base);
      cursor: pointer;
      color: var(--color-white);
    }
  }
`;

function UploadsPanel() {
  return (
    <>
      <Button size='full'>Upload File</Button>
      <Nav>
        <ul>
          <li>
            <a href='#'>images</a>
          </li>
          <li>
            <a href='#'>videos</a>
          </li>
        </ul>
      </Nav>

      <Media>
        {images.map((img, i) => (
          <li key={i}>
            <LuTrash />
          </li>
        ))}
      </Media>
    </>
  );
}
export default UploadsPanel;
