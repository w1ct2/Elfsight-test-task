import axios from 'axios';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  apiUrlToAppSearchString,
  appSearchParamsToApiUrl,
  buildCharacterApiUrl,
  CHARACTER_API_URL,
  EMPTY_DRAFT,
  getPageIndexFromApiUrl,
  searchParamsToDraft,
  speciesToOptions
} from '../../utils/characterFilters';

function getInitialSearchParams() {
  return new URLSearchParams(window.location.search);
}

export function DataProvider({ children }) {
  const initSp = getInitialSearchParams();
  const initialApiUrl = appSearchParamsToApiUrl(initSp);

  const [draft, setDraft] = useState(() => searchParamsToDraft(initSp));
  const [activePage, setActivePage] = useState(() =>
    getPageIndexFromApiUrl(initialApiUrl)
  );
  const [characters, setCharacters] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [info, setInfo] = useState({});
  const [apiURL, setApiURL] = useState(initialApiUrl);
  const [speciesOptions, setSpeciesOptions] = useState([]);

  const fetchData = useCallback(async (url) => {
    setIsFetching(true);
    setIsError(false);

    try {
      const { data } = await axios.get(url);

      setCharacters(data.results);
      setInfo(data.info);
    } catch (e) {
      setIsError(true);
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData(apiURL);
  }, [apiURL, fetchData]);

  useEffect(() => {
    setActivePage(getPageIndexFromApiUrl(apiURL));
  }, [apiURL]);

  useEffect(() => {
    const search = apiUrlToAppSearchString(apiURL);
    const next = `${window.location.pathname}${search}${window.location.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (current !== next) {
      window.history.replaceState(null, '', next);
    }
  }, [apiURL]);

  useEffect(() => {
    const onPopState = () => {
      const sp = new URLSearchParams(window.location.search);

      setDraft(searchParamsToDraft(sp));
      setApiURL(appSearchParamsToApiUrl(sp));
    };

    window.addEventListener('popstate', onPopState);

    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSpecies() {
      const species = new Set();

      try {
        let nextUrl = `${CHARACTER_API_URL}?page=1`;

        while (nextUrl && !cancelled) {
          const { data } = await axios.get(nextUrl);

          data.results?.forEach((c) => species.add(c.species));
          nextUrl = data.info?.next || null;
        }

        if (!cancelled) {
          const sorted = Array.from(species).sort((a, b) => a.localeCompare(b));

          setSpeciesOptions(speciesToOptions(sorted));
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadSpecies();

    return () => {
      cancelled = true;
    };
  }, []);

  const applyFilters = useCallback(() => {
    setApiURL(buildCharacterApiUrl(draft, 1));
  }, [draft]);

  const resetFilters = useCallback(() => {
    setDraft({ ...EMPTY_DRAFT });
    setApiURL(CHARACTER_API_URL);
  }, []);

  const dataValue = useMemo(
    () => ({
      activePage,
      setActivePage,
      apiURL,
      setApiURL,
      characters,
      fetchData,
      isFetching,
      isError,
      info,
      draft,
      setDraft,
      applyFilters,
      resetFilters,
      speciesOptions
    }),
    [
      activePage,
      apiURL,
      characters,
      isFetching,
      isError,
      info,
      fetchData,
      draft,
      applyFilters,
      resetFilters,
      speciesOptions
    ]
  );

  return (
    <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>
  );
}

const DataContext = createContext({});

export const useData = () => useContext(DataContext);
