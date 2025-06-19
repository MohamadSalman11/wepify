import { Toaster } from 'react-hot-toast';
import { Outlet, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Canvas from '../features/editor/Canvas';
import Header from '../features/editor/Header';
import Panel from '../features/editor/panels';
import Sidebar from '../features/editor/Sidebar';

/**
 * Styles
 */

const editorLayout = css`
  display: grid;
  grid-template-columns: 10rem 34rem 3.5fr 34rem;
  grid-template-rows: 8rem 1fr;
`;

const StyledEditor = styled.div<{ isPreview?: boolean }>`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  ${({ isPreview }) => !isPreview && editorLayout}
`;

/**
 * Component definition
 */

function Editor() {
  const location = useLocation();
  const isPreview = location.pathname.endsWith('/preview');

  if (isPreview) {
    return (
      <StyledEditor isPreview={isPreview}>
        <Toaster position='top-center' reverseOrder={false} />
        <Outlet />
      </StyledEditor>
    );
  }

  return (
    <StyledEditor>
      <Toaster position='top-center' reverseOrder={false} />
      <Sidebar />
      <Header />
      <Outlet />
      <Canvas isPreview={false} />
      <Panel panel='settings' sectioned={true} borderDir='left' />
    </StyledEditor>
  );
}

export default Editor;
