import { nanoid } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Path } from '../../../constant';
import { buildPath } from '../../../utils/buildPath';
import { importSiteFromJson } from '../../../utils/importSiteFromJson';
import foodImg from '/templates-images/food.png';
import portfolioImg from '/templates-images/portfolio.png';

/**
 * Constants
 */

const TEMP_TEMPLATES = [
  {
    id: nanoid(),
    description: 'Portfolio - Projects Showcase',
    image: portfolioImg,
    json: '/templates/portfolio.json'
  },
  {
    id: nanoid(),
    description: 'Food - Hero Section',
    image: foodImg,
    json: '/templates/food.json'
  }
];

/**
 * Component definition
 */

export default function Templates() {
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState(Object.fromEntries(TEMP_TEMPLATES.map((t) => [t.id, true])));

  useEffect(() => {
    (async () => {
      for (const template of TEMP_TEMPLATES) {
        const img = new Image();
        img.src = template.image;

        await img.decode?.();
        await new Promise((resolve) => setTimeout(resolve, 350));

        setLoadingImages((prev) => ({ ...prev, [template.id]: false }));
      }
    })();
  }, []);

  const handleTemplateClick = async (jsonPath: string, id: string) => {
    if (loadingId) {
      return;
    }

    setLoadingId(id);

    const res = await fetch(jsonPath);
    const siteData = await res.json();
    const file = new File([JSON.stringify(siteData)], 'site.json', { type: 'application/json' });

    const site = await importSiteFromJson(file);

    if (site) {
      const firstPage = Object.values(site.pages).find((p) => p.isIndex) || Object.values(site.pages)[0];
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate(buildPath(Path.Editor, { siteId: site.id, pageId: firstPage.id }), { state: { site } });
    }

    setLoadingId(null);
  };
  return (
    <>
      <TemplateGrid>
        {TEMP_TEMPLATES.map((template) => (
          <TemplateCard
            $isLoading={loadingId === template.id}
            key={template.id}
            onClick={() => handleTemplateClick(template.json, template.id)}
          >
            <TemplateImageContainer>
              {loadingImages[template.id] ? (
                <SkeletonImage />
              ) : (
                <TemplateImage src={template.image} alt={template.description} $isLoading={loadingId === template.id} />
              )}
              {loadingId === template.id && <Spinner />}
            </TemplateImageContainer>
            {loadingImages[template.id] ? (
              <SkeletonText />
            ) : (
              <TemplateDescription>{template.description}</TemplateDescription>
            )}
          </TemplateCard>
        ))}
      </TemplateGrid>
    </>
  );
}

/**
 * Styles
 */

const TemplateGrid = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2.4rem;
  margin: 0 1.2rem;
`;

const TemplateCard = styled.div<{ $isLoading: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  cursor: pointer;
  pointer-events: ${({ $isLoading }) => ($isLoading ? 'none' : 'auto')};
`;

const TemplateImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 16rem;
  border-radius: var(--border-radius-md);
`;

const TemplateImage = styled.img<{ $isLoading?: boolean }>`
  width: 29rem;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
  filter: ${({ $isLoading }) => ($isLoading ? 'brightness(0.8) blur(2px)' : 'none')};

  &:hover {
    transform: scale(1.03);
  }
`;

const Spinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3rem;
  height: 3rem;
  transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  border: 4px solid rgba(var(--color-white-3-rgb, 255, 255, 255), 0.3);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

const TemplateDescription = styled.p`
  font-size: 1.2rem;
  margin-left: 0.4rem;
  font-weight: var(--font-weight-bold);
`;

const SkeletonImage = styled.div`
  width: 29rem;
  height: 16rem;
  border-radius: var(--border-radius-md);
  background: var(--color-gray-light-3);
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const SkeletonText = styled.div`
  width: 70%;
  height: 1.5rem;
  border-radius: 4px;
  background: var(--color-gray-light-3);
  margin-left: 0.4rem;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;
