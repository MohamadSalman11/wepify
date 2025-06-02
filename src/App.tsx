import styled, { ThemeProvider } from 'styled-components';
import Header from './features/editor/Header';
import Panel from './features/editor/panels';
import Sidebar from './features/editor/Sidebar';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';

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
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <EditorPage>
          <Sidebar />
          <Header />
          <Panel panel='uploads' />
          <div>
            <Canvas>Hi</Canvas>
          </div>
          <Panel panel='settings' sectioned={true} borderDir='left' />
        </EditorPage>
      </ThemeProvider>
    </>
  );
}

export default App;
