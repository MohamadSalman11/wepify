import styled from 'styled-components';
import Canvas from '../features/editor/Canvas';
import Header from '../features/editor/Header';
import Panel from '../features/editor/panels';
import Sidebar from '../features/editor/Sidebar';

const StyledEditor = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 10rem 34rem 3.5fr 34rem;
  grid-template-rows: 8rem 1fr;
  overflow: hidden;
  user-select: none;
`;

function Editor() {
  return (
    <StyledEditor>
      <Sidebar />
      <Header />
      <Panel panel='elements' sectioned={true} />
      <Canvas />
      <Panel panel='settings' sectioned={true} borderDir='left' />
    </StyledEditor>
  );
}

export default Editor;
