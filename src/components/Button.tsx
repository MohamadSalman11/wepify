import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';

/**
 * Constants
 */

const NON_DOM_PROPS = new Set(['variation', 'size', 'outline', 'prefix']);

const DEFAULT_VARIATION = 'primary';
const DEFAULT_SIZE = 'fit';

/**
 * Styles
 */

const variations = {
  primary: css`
    background-color: var(--color-primary);
    color: var(--color-white);

    &:hover {
      background-color: var(--color-primary-light);
    }
  `,
  secondary: css`
    background-color: var(--color-gray-light);
    color: var(--color-white);

    &:hover {
      background-color: var(--color-gray-light-2);
    }
  `
};

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !NON_DOM_PROPS.has(prop)
})<{
  variation: Variation;
  size: Size;
}>`
  ${({ theme: { prefix } }) => css`
    --${prefix}-btn-padding-y: var(--btn-padding-y); 
    --${prefix}-btn-padding-x: var(--btn-padding-x);
    --${prefix}-btn-font-size: var(--btn-font-size);
    --${prefix}-btn-transition: var(--btn-transition);
    --${prefix}-btn-border-radius: var(--btn-border-radius);
    --${prefix}-btn-font-weight: var(--btn-font-weight);
    --${prefix}-btn-white-space: var(--btn-white-space);

    font-size: var(--${prefix}-btn-font-size);
    transition: var(--${prefix}-btn-transition);
    font-weight: var(--${prefix}-btn-font-weight);
    white-space: var(--${prefix}-btn-white-space);
    border-radius: var(--${prefix}-btn-border-radius);
    padding: var(--${prefix}-btn-padding-y) var(--${prefix}-btn-padding-x);
  `}

  ${({ size }) => size === 'full' && 'width: 100%;'}
  ${({ variation }) => variations[variation]}
`;

/**
 * Types
 */

type Variation = 'primary' | 'secondary';
type Size = 'full' | 'fit';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variation?: Variation;
  size?: Size;
}

/**
 * Component definition
 */

function Button({ children, variation = DEFAULT_VARIATION, size = DEFAULT_SIZE, ...props }: ButtonProps) {
  return (
    <StyledButton variation={variation} size={size} {...props}>
      {children}
    </StyledButton>
  );
}

export default Button;
