import { LuMonitor } from 'react-icons/lu';
import styled from 'styled-components';
import Select from './components/Select';
import Header from './features/editor/Header';
import Panel from './features/editor/Panel';
import Sidebar from './features/editor/Sidebar';
import GlobalStyles from './styles/GlobalStyles';

const EditorPage = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 10rem 34rem 3.5fr 34rem;
  grid-template-rows: 8rem 1fr;

  div:nth-child(4) {
    background-color: transparent;
  }
`;

const PanelContainer = styled.div`
  border-left: 1px solid var(--color-gray-dark-2);
  background-color: var(--color-black-light-2);

  & > div {
    display: flex;
    flex-direction: column;
    border-bottom: var(--border-base);
    padding: 3.2rem 2.4rem;
    width: 100%;

    span {
      margin-bottom: 1.6rem;
    }
  }
`;

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.2rem;
  font-size: 1.2rem;

  svg {
    color: var(--color-white);
    font-size: 2.4rem;
  }
`;

const SizeContainer = styled.div`
  & > div {
    display: grid;
    position: relative;
    grid-template-columns: 1fr 1fr;
    gap: 1.6rem;

    div {
      display: flex;
      column-gap: 1.6rem;
      align-items: center;
      color: var(--color-gray);
    }
  }

  input {
    border-radius: var(--border-radius-md);
    background-color: var(--color-gray-dark-2);
    padding: 0.8rem 0.8rem 0.8rem 1.2rem;
    width: 9rem;
    color: var(--color-white);
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
        <PanelContainer>
          <div>
            <span>Selector</span>
            <SelectorContainer>
              <LuMonitor />
              <Select options={['Chocolate', 'Vanilla', 'Strawberry']} />
            </SelectorContainer>
          </div>
          <SizeContainer>
            <span>Size</span>

            <div>
              <div>
                <label htmlFor='y-position'>X</label>
                <input type='text' defaultValue={200} id='y-position' />
              </div>
              <div>
                <label htmlFor='x-position'>Y</label>
                <input type='text' defaultValue={100} id='x-position' />
              </div>
              <div>
                <label htmlFor='width'>W</label>
                <input type='text' defaultValue={100} id='width' />
              </div>
              <div>
                <label htmlFor='height'>H</label>
                <input type='text' defaultValue={100} id='height' />
              </div>
            </div>
          </SizeContainer>
        </PanelContainer>
      </EditorPage>
    </>
  );
}

export default App;
