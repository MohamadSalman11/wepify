import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Breakpoint, Path } from '../constant';
import Button from './Button';
import Divider from './divider';
import Header from './Header';

/**
 * Component definition
 */

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Container>
        <title>Wepify | 404</title>
        <Title>404</Title>
        <Subtitle>PAGE NOT FOUND</Subtitle>
        <Divider />
        <Message>We understand, sometimes things get lost in the digital world. Let's get you back on track.</Message>
        <Button variation='outline' size='sm' onClick={() => navigate(Path.Home)}>
          Take me home
        </Button>
      </Container>
    </>
  );
}

/**
 * Styles
 */

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 40rem;

  @media (max-width: ${Breakpoint.Phone}em) {
    width: 90%;
  }
`;

const Title = styled.h1`
  font-size: 6rem;
  color: var(--color-primary);
`;

const Subtitle = styled.h2`
  margin-top: 1.2rem;
  font-weight: var(--font-weight-medium);
`;

const Message = styled.p`
  font-size: 1.4rem;
  margin-top: 1.2rem;
  margin-bottom: 2.4rem;
`;
