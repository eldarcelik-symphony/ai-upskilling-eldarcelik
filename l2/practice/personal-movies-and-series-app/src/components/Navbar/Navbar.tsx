import React, { useContext, useMemo, useCallback } from 'react';
import { MoviesShowsContext } from '../../Context';
import { CONTENT_TYPE, SHOW_PLACEHOLDER, MOVIE_PLACEHOLDER } from '../../constants';
import { AppContextInterface } from '../../types';

export default function Navbar() {
  const context = useContext(MoviesShowsContext) as AppContextInterface;
  const { search, contentType, setSearch, setContentType } = context;

  // Memoize computed values
  const searchContent = useMemo(
    () => (contentType === CONTENT_TYPE.TV_SHOW ? SHOW_PLACEHOLDER : MOVIE_PLACEHOLDER),
    [contentType],
  );

  const isShowsActive = useMemo(() => contentType === CONTENT_TYPE.TV_SHOW, [contentType]);

  const isMoviesActive = useMemo(() => contentType === CONTENT_TYPE.MOVIE, [contentType]);

  // Memoize event handlers
  const handleContent = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const { value } = event.currentTarget;
      setContentType(value);
    },
    [setContentType],
  );

  const onSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.currentTarget.value);
    },
    [setSearch],
  );

  // Memoize button class names
  const getButtonClassName = useCallback(
    (isActive: boolean) =>
      `inline-flex items-center h-[35px] mx-[5px] px-6 py-2.5 mt-0 text-base whitespace-nowrap text-center border-none rounded-lg outline-none cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-danger text-secondary' : 'bg-secondary text-primary hover:bg-gray-200'
      }`,
    [],
  );

  return (
    <nav
      className='bg-primary h-20 w-full min-w-[300px] flex justify-between items-center px-[50px] text-xl sticky top-0 z-10'
      role='navigation'
      aria-label='Content type and search navigation'
    >
      <div className='flex justify-between items-center' role='group' aria-label='Content type selection'>
        <button
          className={getButtonClassName(isShowsActive)}
          value={CONTENT_TYPE.TV_SHOW}
          onClick={handleContent}
          aria-pressed={isShowsActive}
          aria-label={`Show ${SHOW_PLACEHOLDER}s`}
        >
          {`${SHOW_PLACEHOLDER}s`}
        </button>
        <button
          className={getButtonClassName(isMoviesActive)}
          value={CONTENT_TYPE.MOVIE}
          onClick={handleContent}
          aria-pressed={isMoviesActive}
          aria-label={`Show ${MOVIE_PLACEHOLDER}s`}
        >
          {`${MOVIE_PLACEHOLDER}s`}
        </button>
      </div>
      <input
        type='text'
        placeholder={`Search for ${searchContent}`}
        value={search}
        onChange={onSearchChange}
        aria-label={`Search for ${searchContent}`}
        role='searchbox'
        className='h-[35px] w-[200px] ml-auto px-2.5 py-2.5 border-none rounded-lg outline-none bg-secondary transition-[width] duration-400 ease-in-out focus:w-[30%] md:focus:w-[30%] sm:focus:w-[170px] sm:w-[270px] sm:focus:w-[170px] xs:justify-around xs:h-[35px] xs:mx-0 xs:text-base xs:w-[160px] xs:focus:w-[160px]'
      />
    </nav>
  );
}
