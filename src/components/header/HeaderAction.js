import styled from 'styled-components';

export function HeaderAction({ children }) {
  return <HeaderActionContainer>{children}</HeaderActionContainer>;
}

const HeaderActionContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-width: 560px;

  @media (max-width: 530px) {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 240px;
  }
`;
