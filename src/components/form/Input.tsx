import type { InputHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

/**
 * Styles
 */

const StyledInput = styled.input`
  ${({ theme: { prefix } }) => css`
    --${prefix}-input-padding-y: var(--input-padding-y); 
    --${prefix}-input-padding-x: var(--input-padding-x);
    --${prefix}-input-font-size: var(--input-font-size);
    --${prefix}-input-border-radius: var(--input-border-radius);

      width: 100%;
      color: var(--color-white);
      border-radius: var(--${prefix}-input-border-radius);
      background-color: var(--color-gray-dark-2);
      padding: var(--${prefix}-input-padding-y) var(--${prefix}-input-padding-x);

      &:disabled{
        background-color: var(--color-gray-dark-3);
      }
  `}
`;

/**
 * Component definition
 */

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <StyledInput autoComplete='off' {...props} />;
}

export default Input;
