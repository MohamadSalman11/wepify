import styled from 'styled-components';
import Sidebar from './features/editor/Sidebar';
import GlobalStyles from './styles/GlobalStyles';

const EditorPage = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 11rem 1fr 3fr 1fr;
  grid-template-rows: 8rem 1fr;

  div:nth-child(2) {
    grid-column: 2 / 5;
    border-bottom: var(--border-base);
    background-color: var(--color-black-light-2);
  }

  div:nth-child(3) {
    border-right: var(--border-base);
    background-color: var(--color-black-light-2);
  }

  div:nth-child(4) {
    background-color: transparent;
  }

  div:nth-child(5) {
    border-left: 1px solid var(--color-gray-dark-2);
    background-color: var(--color-black-light-2);
  }
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <EditorPage>
        <Sidebar />
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </EditorPage>
    </>
  );
}

export default App;
