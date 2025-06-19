import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styled, { css, type RuleSet } from 'styled-components';

/**
 * Constants
 */

const NON_DOM_PROPS = new Set(['variation', 'size', 'fullWidth', 'pill', 'outline', 'prefix']);

const DEFAULT_VARIATION = 'primary';
const DEFAULT_SIZE = 'md';

/**
 * Styles
 */

const variations = {
  primary: css`
    background-color: var(--color-primary);

    &:hover {
      background-color: var(--color-primary-light);
    }
  `,
  secondary: css`
    background-color: var(--color-gray-light);

    &:hover {
      background-color: var(--color-gray-light-2);
    }
  `,
  outline: css`
    border: 2px solid var(--color-primary);
    background-color: transparent;
    color: var(--color-black-light);

    &:hover {
      scale: 1.05;
    }
  `,
  danger: css`
    background-color: var(--color-red);
  `
};

const sizes: Record<Size, RuleSet> = {
  sm: css`
    ${({ theme: { prefix } }) => css`
    --${prefix}-btn-padding-y-sm: var(--btn-padding-y-sm); 
    --${prefix}-btn-padding-x-sm: var(--btn-padding-x-sm);
    --${prefix}-btn-font-size-sm: var(--btn-font-size-sm);

    font-size: var(--${prefix}-btn-font-size-sm);
    padding: var(--${prefix}-btn-padding-y-sm) var(--${prefix}-btn-padding-x-sm);
  `}
  `,
  md: css`
    ${({ theme: { prefix } }) => css`
    --${prefix}-btn-padding-y: var(--btn-padding-y); 
    --${prefix}-btn-padding-x: var(--btn-padding-x);
    --${prefix}-btn-font-size: var(--btn-font-size);

    font-size: var(--${prefix}-btn-font-size);
    padding: var(--${prefix}-btn-padding-y) var(--${prefix}-btn-padding-x);
  `}
  `
};

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !NON_DOM_PROPS.has(prop)
})<{
  variation: Variation;
  size: Size;
  fullWidth: boolean;
  pill: boolean;
}>`
  ${({ theme: { prefix }, fullWidth, pill }) => css`
    --${prefix}-btn-transition: var(--btn-transition);
    --${prefix}-btn-border-radius: var(--btn-border-radius);
    --${prefix}-btn-font-weight: var(--btn-font-weight);
    --${prefix}-btn-white-space: var(--btn-white-space);
    --${prefix}-btn-color: var(--color-white);

    color: var(--${prefix}-btn-color);
    transition: var(--${prefix}-btn-transition);
    font-weight: var(--${prefix}-btn-font-weight);
    white-space: var(--${prefix}-btn-white-space);
    border-radius: ${pill ? 'var(--border-radius-full)' : `var(--${prefix}-btn-border-radius)`};
   ${fullWidth && 'width: 100%;'}
  `}

  ${({ size }) => sizes[size]}
  ${({ variation }) => variations[variation]}
`;

/**
 * Types
 */

type Variation = keyof typeof variations;
type Size = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variation?: Variation;
  size?: Size;
  fullWidth?: boolean;
  pill?: boolean;
}

/**
 * Component definition
 */

function Button({
  children,
  variation = DEFAULT_VARIATION,
  size = DEFAULT_SIZE,
  fullWidth = false,
  pill = false,
  ...props
}: ButtonProps) {
  return (
    <StyledButton variation={variation} size={size} fullWidth={fullWidth} pill={pill} {...props}>
      {children}
    </StyledButton>
  );
}

export default Button;
