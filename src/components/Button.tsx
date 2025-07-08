import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import type { IconType } from 'react-icons';
import styled, { css, type RuleSet } from 'styled-components';
import Icon from './Icon';

/**
 * Constants
 */

const DEFAULT_VARIATION = 'primary';
const DEFAULT_SIZE = 'md';
const ELEMENT_LINK = 'a';
const ELEMENT_BUTTON = 'button';

/**
 * Types
 */

type Variation = keyof typeof variations;
type Size = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: IconType;
  variation?: Variation;
  size?: Size;
  fullWidth?: boolean;
  pill?: boolean;
  asLink?: boolean;
  href?: string;
  target?: string;
}

/**
 * Component definition
 */

export default function Button({
  children,
  icon,
  variation = DEFAULT_VARIATION,
  size = DEFAULT_SIZE,
  fullWidth = false,
  pill = false,
  asLink = false,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      as={asLink ? ELEMENT_LINK : ELEMENT_BUTTON}
      $variation={variation}
      $size={size}
      $fullWidth={fullWidth}
      $pill={pill}
      $hasIcon={!!icon}
      {...props}
    >
      {icon && <Icon icon={icon} />} {children}
    </StyledButton>
  );
}

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

    &:disabled {
      background-color: var(--color-gray-light);
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

const StyledButton = styled.button<{
  $variation: Variation;
  $size: Size;
  $fullWidth: boolean;
  $pill: boolean;
  $hasIcon: boolean;
}>`
  ${({ theme: { prefix }, $variation, $size, $fullWidth, $pill, $hasIcon }) => css`
  --${prefix}-btn-transition: var(--btn-transition);
  --${prefix}-btn-border-radius: var(--btn-border-radius);
  --${prefix}-btn-font-weight: var(--btn-font-weight);
  --${prefix}-btn-white-space: var(--btn-white-space);
  --${prefix}-btn-color: var(--color-white);

  color: var(--${prefix}-btn-color);
  transition: var(--${prefix}-btn-transition);
  font-weight: var(--${prefix}-btn-font-weight);
  white-space: var(--${prefix}-btn-white-space);
  border-radius: ${$pill ? 'var(--border-radius-full)' : `var(--${prefix}-btn-border-radius)`};
  text-decoration: none;
  ${$fullWidth && 'width: 100%;'}

  svg{
    color: currentColor;
  }

  ${
    $hasIcon &&
    css`
      display: flex;
      column-gap: 1.2rem;
      justify-content: center;
      align-items: center;
    `
  }

  ${sizes[$size]};
  ${variations[$variation]};
`}
`;
