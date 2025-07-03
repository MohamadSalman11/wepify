import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Path } from '../constant';

/**
 * Component definition
 */

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <Container>
        <Title>Build websites in minutes without writing any code</Title>
        <Subtitle>
          Wepify helps you design, edit, and publish websites with zero coding — just drag, drop, and go live.
        </Subtitle>
        <ButtonGroup>
          <Button onClick={() => navigate(Path.Dashboard)}>Start Building</Button>
          <Button variation='secondary'>Watch Video</Button>
        </ButtonGroup>
      </Container>
      <ImageWrapper>
        <img src='/hero-img.png' />
      </ImageWrapper>
      <Footer />
    </div>
  );
}

/**
 * Styles
 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6rem 2rem 2.4rem 2rem;
  text-align: center;
  width: 80rem;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 6rem;
  margin-bottom: 1.6rem;
  font-weight: 400;
`;

const Subtitle = styled.p`
  font-size: 1.6rem;
  color: var(--color-gray);
  margin-bottom: 3.2rem;
  max-width: 48rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.6rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ImageWrapper = styled.div`
  margin: 0 auto;
  width: fit-content;
`;
