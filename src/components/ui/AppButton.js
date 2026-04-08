import { forwardRef } from 'react';
import styled from 'styled-components';

const BORDER = '#83BF46';
const TEXT_ON_FILL = '#ffffff';

const Root = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 10px 24px;
  border: 1px solid ${BORDER};
  border-radius: 10px;
  background-color: transparent;
  color: ${BORDER};
  font-family: inherit;
  font-size: 14px;
  line-height: 1.35;
  font-weight: inherit;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background-color: ${BORDER};
    color: ${TEXT_ON_FILL};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const AppButton = forwardRef(function AppButton(
  { type = 'button', children, ...rest },
  ref
) {
  return (
    <Root ref={ref} type={type} {...rest}>
      {children}
    </Root>
  );
});
