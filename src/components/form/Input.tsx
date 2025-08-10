import { forwardRef, type InputHTMLAttributes } from 'react';
import styled, { css, type RuleSet } from 'styled-components';

/**
 * Constants
 */

const DEFAULT_SIZE = 'sm';

/**
 * Types
 */

type Size = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size;
  pill?: boolean;
}

/**
 * Component definition
 */

const Input = forwardRef<HTMLInputElement, InputProps>(({ size = DEFAULT_SIZE, pill = false, ...props }, ref) => {
  return <StyledInput ref={ref} $size={size} $pill={pill} autoComplete='off' {...props} />;
});

/**
 * Styles
 */

const sizes: Record<Size, RuleSet> = {
  sm: css`
    ${({ theme: { prefix } }) => css`
    --${prefix}-input-padding-y-sm: var(--input-padding-y-sm);
    --${prefix}-input-padding-x-sm: var(--input-padding-x-sm);
    --${prefix}-input-font-size-sm: var(--input-font-size-sm);

    font-size: var(--${prefix}-input-font-size-sm);
    padding: var(--${prefix}-input-padding-y-sm) var(--${prefix}-input-padding-x-sm);
  `}
  `,
  md: css`
    ${({ theme: { prefix } }) => css`
    --${prefix}-input-padding-y: var(--input-padding-y);
    --${prefix}-input-padding-x: var(--input-padding-x);
    --${prefix}-input-font-size: var(--input-font-size);

    font-size: var(--${prefix}-input-font-size);
    padding: var(--${prefix}-input-padding-y) var(--${prefix}-input-padding-x);
  `}
  `,
  lg: css`
    ${({ theme: { prefix } }) => css`
    --${prefix}-input-padding-y-lg: var(--input-padding-y-lg);
    --${prefix}-input-padding-x-lg: var(--input-padding-x-lg);
    --${prefix}-input-font-size-lg: var(--input-font-size-lg);

    font-size: var(--${prefix}-input-font-size-lg);
    padding: var(--${prefix}-input-padding-y-lg) var(--${prefix}-input-padding-x-lg);
  `}
  `
};

const StyledInput = styled.input<{ $size: Size; $pill: boolean }>`
  ${({ theme: { prefix }, $size, $pill }) => css`
    --${prefix}-input-border-radius: var(--input-border-radius);

      color: var(--color-black-light);
      border-radius: ${$pill ? 'var(--border-radius-full)' : `var(--${prefix}-input-border-radius)`};
      background-color: var(--color-white-3);
      width: 100%;

      &::placeholder {
        color: var(--color-gray);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;

        &::placeholder {
         color:var(--color-gray-light);
        }
      }

      ${sizes[$size]}
  `}
`;

export default Input;
