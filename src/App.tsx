import styled from 'styled-components';
import ElementsPanel from './features/editor/ElementsPanel';
import Header from './features/editor/Header';
import SettingsPanel from './features/editor/SettingsPanel';
import Sidebar from './features/editor/Sidebar';
import GlobalStyles from './styles/GlobalStyles';

const EditorPage = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 10rem 34rem 3.5fr 34rem;
  grid-template-rows: 8rem 1fr;
  overflow: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

  div:nth-child(4) {
    background-color: transparent;
  }
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <EditorPage>
        <Sidebar />
        <Header />
        <ElementsPanel />
        <div></div>
        <SettingsPanel />
      </EditorPage>
    </>
  );
}

export default App;
