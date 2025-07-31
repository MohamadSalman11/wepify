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

const KEY_CLOSE_PREVIEW = 'Escape';

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
      <ClosePreviewButton onClick={handleClose}>Close Preview</ClosePreviewButton>
      <Canvas isPreview={true} />
    </>
  );
}

/**
 * Styles
 */

const ClosePreviewButton = styled(Button).attrs({
  size: 'sm',
  pill: true
})`
  position: fixed;
  bottom: 2%;
  left: 1%;
  z-index: var(--zindex-preview-close-button);
`;
