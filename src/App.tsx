import styled from 'styled-components';
import Header from './features/editor/Header';
import Layers from './features/editor/Layers';
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
  user-select: none;

  &::-webkit-scrollbar {
    display: none;
  }

  div:nth-child(4) {
    display: flex;
    justify-content: center;
    background-color: transparent;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const Canvas = styled.div`
  width: 80%;
  height: 50vh;
  background-color: var(--color-white);
  color: var(--color-black);
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <EditorPage>
        <Sidebar />
        <Header />
        <Layers />
        {/* <Pages /> */}
        {/* <Uploads /> */}
        {/* <ElementsPanel /> */}
        <div>
          <Canvas>Hi</Canvas>
        </div>
        <SettingsPanel />
      </EditorPage>
    </>
  );
}

export default App;
