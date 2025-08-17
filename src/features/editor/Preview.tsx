import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import { EditorPath } from '../../constant';
import { useAppSelector } from '../../store';
import Canvas from './Canvas';
import { setIsLoading } from './slices/editorSlice';
import { setHasOriginSize } from './slices/pageSlice';

/**
 * Constants
 */

const KEY_CLOSE_PREVIEW = 'Escape';
const SCREEN_SIZE_INSTRUCTIONS = 'Press F12 (or Cmd+Option+I on Mac) to preview this page on different screen sizes.';

/**
 * Component definition
 */

export default function Preview() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useAppSelector((state) => state.editor.isLoading);

  const handleClose = useCallback(() => {
    const newPath = location.pathname.replace(new RegExp(`${EditorPath.Preview}$`), EditorPath.Elements);
    dispatch(setHasOriginSize(false));
    navigate(newPath);
    dispatch(setIsLoading(true));
  }, [dispatch, location.pathname, navigate]);

  useEffect(() => {
    if (isLoading) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEY_CLOSE_PREVIEW) {
        handleClose();
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, isLoading]);

  return (
    <>
      <ButtonContainer>
        <StyledButton onClick={() => alert(SCREEN_SIZE_INSTRUCTIONS)}>Preview on Screen Sizes</StyledButton>
        <StyledButton variation='danger' onClick={handleClose}>
          Close Preview
        </StyledButton>
      </ButtonContainer>
      <Canvas isPreview />
    </>
  );
}

/**
 * Styles
 */

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 2%;
  left: 1%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.2rem;
  z-index: var(--zindex-preview-close-button);
`;

const StyledButton = styled(Button).attrs({
  size: 'sm',
  pill: true
})`
  box-shadow: var(--box-shadow-2);
`;
