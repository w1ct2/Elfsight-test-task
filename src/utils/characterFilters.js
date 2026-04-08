export const CHARACTER_API_URL = 'https://rickandmortyapi.com/api/character/';

/** Значения фильтров, как в документации REST API (нижний регистр где указано). */
export const STATUS_OPTIONS = [
  { value: 'alive', label: 'Alive' },
  { value: 'dead', label: 'Dead' },
  { value: 'unknown', label: 'unknown' }
];

export const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'genderless', label: 'Genderless' },
  { value: 'unknown', label: 'unknown' }
];

export const EMPTY_DRAFT = {
  name: '',
  status: '',
  gender: '',
  species: '',
  type: ''
};

export function searchParamsToDraft(searchParams) {
  const status = searchParams.get('status') ?? '';
  const gender = searchParams.get('gender') ?? '';

  return {
    name: searchParams.get('name') ?? '',
    status: status ? status.toLowerCase() : '',
    gender: gender ? gender.toLowerCase() : '',
    species: searchParams.get('species') ?? '',
    type: searchParams.get('type') ?? ''
  };
}

export function buildCharacterApiUrl(draft, page = 1) {
  const url = new URL(CHARACTER_API_URL);

  if (draft.name) {
    url.searchParams.set('name', draft.name);
  }
  if (draft.status) {
    url.searchParams.set('status', String(draft.status).toLowerCase());
  }
  if (draft.gender) {
    url.searchParams.set('gender', String(draft.gender).toLowerCase());
  }
  if (draft.species) {
    url.searchParams.set('species', draft.species);
  }
  if (draft.type) {
    url.searchParams.set('type', draft.type);
  }

  if (page > 1) {
    url.searchParams.set('page', String(page));
  }

  return url.href;
}

export function appSearchParamsToApiUrl(searchParams) {
  const draft = searchParamsToDraft(searchParams);
  const page = parseInt(searchParams.get('page') || '1', 10);

  return buildCharacterApiUrl(draft, Number.isNaN(page) ? 1 : page);
}

export function getPageIndexFromApiUrl(apiUrl) {
  const url = new URL(apiUrl);
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  return Math.max(0, (Number.isNaN(page) ? 1 : page) - 1);
}

/**
 * Строка query для адресной строки SPA (без page=1 по умолчанию).
 */
export function apiUrlToAppSearchString(apiUrl) {
  const url = new URL(apiUrl);
  const out = new URLSearchParams();

  ['name', 'status', 'gender', 'species', 'type'].forEach((key) => {
    const value = url.searchParams.get(key);
    if (value) {
      out.set(key, value);
    }
  });

  const page = url.searchParams.get('page');
  if (page && page !== '1') {
    out.set('page', page);
  }

  const s = out.toString();

  return s ? `?${s}` : '';
}

export function speciesToOptions(speciesList) {
  return speciesList.map((s) => ({ value: s, label: s }));
}
