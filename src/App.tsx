import styled from 'styled-components';
import Header from './features/editor/Header';
import Panel from './features/editor/Panel';
import Sidebar from './features/editor/Sidebar';
import GlobalStyles from './styles/GlobalStyles';

const EditorPage = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 10rem 1fr 3.5fr 1fr;
  grid-template-rows: 8rem 1fr;

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
        <Header />
        <Panel />
        <div></div>
        <div></div>
      </EditorPage>
    </>
  );
}

export default App;
