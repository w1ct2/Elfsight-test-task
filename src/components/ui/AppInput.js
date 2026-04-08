import { forwardRef } from 'react';
import styled from 'styled-components';

const BG = '#263750';
const BG_ACTIVE = '#334466';
const TEXT = '#f2f5f9';
const PLACEHOLDER = '#B3B3B3';
const BORDER = '#83BF46';

const Root = styled.input`
  display: block;
  width: 100%;
  height: 40px;
  max-width: 180px;
  padding: 10px 14px;
  border: 1px solid ${BORDER};
  border-radius: 10px;
  background-color: ${BG};
  color: ${TEXT};
  font-family: inherit;
  font-size: 14px;
  line-height: 1.35;
  outline: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &::placeholder {
    color: ${PLACEHOLDER};
    opacity: 1;
  }

  &:hover {
    background-color: ${BG_ACTIVE};
  }

  &:focus {
    background-color: ${BG_ACTIVE};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  @media (max-width: 530px) {
    max-width: 240px;
  }
`;

export const AppInput = forwardRef(function AppInput(props, ref) {
  return <Root ref={ref} {...props} />;
});
