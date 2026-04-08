import styled from 'styled-components';
import { Logo } from './Logo';
import { AppInput } from '../ui/AppInput';
import { HeaderAction } from './HeaderAction';
import { AppSelect } from '../ui/AppSelect';
import { AppButton } from '../ui/AppButton';

export function Header() {
  return (
    <HeaderContainer>
      <Logo />
      <HeaderAction>
        <AppSelect
          options={[
            { value: 'Alive', label: 'Alive' },
            { value: 'Dead', label: 'Dead' },
            { value: 'Unknown', label: 'Unknown' }
          ]}
          placeholder="Status"
        />
        <AppSelect
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Genderless', label: 'Genderless' },
            { value: 'Unknown', label: 'Unknown' }
          ]}
          placeholder="Gender"
        />
        <AppSelect
          options={[
            { value: 'Human', label: 'Human' },
            { value: 'Alien', label: 'Alien' },
            { value: 'Humanoid', label: 'Humanoid' },
            { value: 'Poopybutthole', label: 'Poopybutthole' },
            { value: 'Mythological', label: 'Mythological' },
            { value: 'Unknown', label: 'Unknown' },
            { value: 'Animal', label: 'Animal' },
            { value: 'Disease', label: 'Disease' },
            { value: 'Robot', label: 'Robot' },
            { value: 'Cronenberg', label: 'Cronenberg' },
            { value: 'Planet', label: 'Planet' }
          ]}
          placeholder="Species"
        />
        <AppInput placeholder="Name" />
        <AppInput placeholder="Type" />
        <HeaderButtons>
          <AppButton>
            <span>Apply</span>
          </AppButton>
          <AppButton>
            <span>Reset</span>
          </AppButton>
        </HeaderButtons>
      </HeaderAction>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 950px) {
    flex-direction: column;
    justify-content: center;
    gap: 30px;
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 530px) {
    flex-direction: column;
  }
`;
