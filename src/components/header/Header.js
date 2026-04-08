import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Logo } from './Logo';
import { AppInput } from '../ui/AppInput';
import { HeaderAction } from './HeaderAction';
import { AppSelect } from '../ui/AppSelect';
import { AppButton } from '../ui/AppButton';
import { useData } from '../providers';
import { GENDER_OPTIONS, STATUS_OPTIONS } from '../../utils/characterFilters';

export function Header() {
  const {
    draft,
    setDraft,
    applyFilters,
    resetFilters,
    speciesOptions
  } = useData();

  const speciesSelectOptions = useMemo(() => {
    if (!draft.species) {
      return speciesOptions;
    }

    if (speciesOptions.some((o) => o.value === draft.species)) {
      return speciesOptions;
    }

    return [...speciesOptions, { value: draft.species, label: draft.species }];
  }, [speciesOptions, draft.species]);

  const onStatusChange = useCallback(
    (opt) => {
      setDraft((d) => ({ ...d, status: opt?.value ?? '' }));
    },
    [setDraft]
  );

  const onGenderChange = useCallback(
    (opt) => {
      setDraft((d) => ({ ...d, gender: opt?.value ?? '' }));
    },
    [setDraft]
  );

  const onSpeciesChange = useCallback(
    (opt) => {
      setDraft((d) => ({ ...d, species: opt?.value ?? '' }));
    },
    [setDraft]
  );

  const onNameChange = useCallback(
    (e) => {
      setDraft((d) => ({ ...d, name: e.target.value }));
    },
    [setDraft]
  );

  const onTypeChange = useCallback(
    (e) => {
      setDraft((d) => ({ ...d, type: e.target.value }));
    },
    [setDraft]
  );

  return (
    <HeaderContainer>
      <Logo />
      <HeaderAction>
        <AppSelect
          options={STATUS_OPTIONS}
          value={draft.status}
          onChange={onStatusChange}
          placeholder="Status"
        />
        <AppSelect
          options={GENDER_OPTIONS}
          value={draft.gender}
          onChange={onGenderChange}
          placeholder="Gender"
        />
        <AppSelect
          options={speciesSelectOptions}
          value={draft.species}
          onChange={onSpeciesChange}
          placeholder="Species"
        />
        <AppInput
          placeholder="Name"
          value={draft.name}
          onChange={onNameChange}
        />
        <AppInput
          placeholder="Type"
          value={draft.type}
          onChange={onTypeChange}
        />
        <HeaderButtons>
          <AppButton type="button" onClick={applyFilters}>
            <span>Apply</span>
          </AppButton>
          <AppButton type="button" onClick={resetFilters}>
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
