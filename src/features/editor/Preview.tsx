import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import { EditorPath } from '../../constant';
import Canvas from './Canvas';
import { setIsLoading } from './slices/editorSlice';

/**
 * Styles
 */

const ClosePreviewButton = styled(Button).attrs({ size: 'sm', pill: true })`
  position: fixed;
  bottom: 2%;
  left: 1%;
  z-index: 99999;
`;

/**
 * Component definition
 */

function Preview() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleClose = () => {
    const newPath = location.pathname.replace(new RegExp(`${EditorPath.Preview}$`), EditorPath.Elements);
    navigate(newPath, { replace: true });
    dispatch(setIsLoading(true));
  };

  return (
    <>
      <ClosePreviewButton onClick={handleClose}>Close Preview</ClosePreviewButton>
      <Canvas isPreview={true} />
    </>
  );
}

export default Preview;
