import React, { useContext, useMemo, useCallback } from 'react';
import { MoviesShowsContext } from '../../Context';
import { CONTENT_TYPE, SHOW_PLACEHOLDER, MOVIE_PLACEHOLDER } from '../../constants';
import { AppContextInterface } from '../../types';
import './Navbar.css';

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
  const getButtonClassName = useCallback((isActive: boolean) => `navbar-button-item${isActive ? ' active' : ''}`, []);

  return (
    <nav className='navbar' role='navigation' aria-label='Content type and search navigation'>
      <div className='navbar-buttons-container' role='group' aria-label='Content type selection'>
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
      />
    </nav>
  );
}
