import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Breakpoint, DashboardPath, Path } from '../constant';

/**
 * Component definition
 */

export default function Home() {
  const navigate = useNavigate();

  return (
    <StyledHome>
      <title>Wepify - Build websites in minutes without coding</title>
      <Header />
      <Container>
        <Title>Build websites in minutes without writing any code</Title>
        <Subtitle>
          Wepify helps you design, edit, and publish websites with zero coding — just drag, drop, and go live.
        </Subtitle>
        <ButtonGroup>
          <Button onClick={() => navigate(Path.Dashboard)}>Start Building</Button>
          <Button variation='secondary' onClick={() => navigate(`${Path.Dashboard}/${DashboardPath.Templates}`)}>
            Use Template
          </Button>
        </ButtonGroup>
      </Container>
      <ImageWrapper>
        <PreviewImage src='/home-img.png' alt='Wepify editor' />
      </ImageWrapper>
      <Footer />
    </StyledHome>
  );
}

/**
 * Styles
 */

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`;

const Container = styled.div`
  margin: 0 6.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 2.4rem;
  padding: 5.4rem 2.4rem 2.4rem 2.4rem;
  text-align: center;
  max-width: 85rem;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 6.2rem;
  font-weight: var(--font-weight-regular);

  @media (max-width: ${Breakpoint.TabLand}em) {
    font-size: 5.2rem;
  }

  @media (max-width: ${Breakpoint.Phone}em) {
    font-size: 3.6rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.6rem;
  max-width: 48rem;

  @media (max-width: ${Breakpoint.Phone}em) {
    font-size: 1.4rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.6rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1.2rem;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 8rem auto;
  max-width: 120rem;
  padding: 0 2rem;
  perspective: 2000px;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 105rem;
  height: auto;

  border-radius: var(--border-radius-xl);
  border: 7px solid var(--color-white-3);
  background: var(--color-white);
  transform: skewY(-1.5deg) rotateX(1deg);
  box-shadow: var(--box-shadow-2);

  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;

  &:hover {
    transform: skewY(-1.5deg) rotateX(1deg) translateY(-8px) scale(1.02);
  }
`;
