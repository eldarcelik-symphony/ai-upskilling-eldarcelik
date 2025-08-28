import React, { useState, useEffect, createContext } from 'react';
import {
  NUMBER_OF_ITEMS,
  CONTENT_TYPE,
  DEFAULT_SEARCH_VALUE,
  DELAY,
  MIN_SEARCH_CHARACTERS,
  QUERY_TYPE,
} from './constants';
import { AppContextInterface, IShow, IMovie } from './types';
import { axios } from './axios';

type ContextProps = {
  children: React.ReactNode;
};

const MoviesShowsContext = createContext({} as AppContextInterface);
let timer: ReturnType<typeof setTimeout> | null = null;

function MoviesShowsProvider({ children }: ContextProps) {
  const [shows, setShows] = useState<IShow[]>([]);
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [activeQueryType, setActiveQueryType] = useState<string>(QUERY_TYPE.TOP_RATED);
  const [loading, setLoading] = useState<boolean>(true);
  const [contentType, setContentType] = useState<string>(CONTENT_TYPE.TV_SHOW);
  const [search, setSearch] = useState<string>(DEFAULT_SEARCH_VALUE);

  const QUERY_TYPE_INFO = {
    [QUERY_TYPE.TOP_RATED]: `/${contentType}/top_rated`,
    [QUERY_TYPE.SEARCH]: `/search/${contentType}?query=${search}`,
  };

  const getItems = (quryType: string) =>
    axios
      .get(QUERY_TYPE_INFO[quryType])
      .then((res) => {
        const { results } = res.data;
        const items = quryType === QUERY_TYPE.TOP_RATED ? results.slice(0, NUMBER_OF_ITEMS) : results;

        if (contentType === CONTENT_TYPE.TV_SHOW) {
          setShows(items);
        } else {
          setMovies(items);
        }
      })
      .catch((error) => {
        // TODO: Handle errors
        console.error('Error fetching items:', error);
      })
      .finally(() => {
        setLoading(false);
      });

  useEffect(() => {
    const queryType = search.length >= MIN_SEARCH_CHARACTERS ? QUERY_TYPE.SEARCH : QUERY_TYPE.TOP_RATED;
    setActiveQueryType(queryType);

    // Prevent calling api in time scope of 1s
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // The search is performed only when there are 3 or more characters in the search bar
    // It should be triggered only one second after the user has stopped typing
    if (queryType === QUERY_TYPE.SEARCH) {
      timer = setTimeout(
        () =>
          getItems(queryType).then(() => {
            if (timer) {
              clearTimeout(timer);
              timer = null;
            }
          }),
        DELAY,
      );
    } // Prevent getting top 10 items multiple times if there are 2 or less characters in the search bar
    else if (queryType !== activeQueryType) {
      getItems(queryType);
    }
  }, [search, activeQueryType]); // eslint-disable-line react-hooks/exhaustive-deps

  // Triggered on switching between tabs
  useEffect(() => {
    getItems(activeQueryType);
  }, [contentType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MoviesShowsContext.Provider
      value={{
        movies,
        setMovies,
        shows,
        setShows,
        activeQueryType,
        loading,
        setLoading,
        contentType,
        setContentType,
        search,
        setSearch,
      }}
    >
      {children}
    </MoviesShowsContext.Provider>
  );
}

const MoviesShowsConsumer = MoviesShowsContext.Consumer;

export { MoviesShowsContext, MoviesShowsProvider, MoviesShowsConsumer };
