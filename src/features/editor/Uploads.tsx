import styled from 'styled-components';

const UploadsContainer = styled.div`
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

  nav ul {
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

const Media = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  list-style: none;
  margin-top: 1.6rem;

  li {
    border-radius: var(--border-radius-md);
    background-color: var(--color-primary-light);
    width: 100%;
    height: 7rem;
  }
`;

function Uploads() {
  return (
    <UploadsContainer>
      <button>Upload File</button>
      <nav>
        <ul>
          <li>
            <a href='#'>images</a>
          </li>
          <li>
            <a href='#'>videos</a>
          </li>
        </ul>
      </nav>

      <Media>
        {images.map((img) => (
          <li>&nbsp;</li>
        ))}
      </Media>
    </UploadsContainer>
  );
}
export default Uploads;
