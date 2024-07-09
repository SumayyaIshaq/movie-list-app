import React, { useEffect, useState, useRef, useCallback } from 'react';
import useMovies from '../../Hooks/useMovies';
import Card from './Card';
import Loader from '../../Utils/Loader';
import debounce from '../../Utils/debounce';

const MovieList = ({ selectedGenres, searchResults, isSearching, searchQuery, onSearch, searchPage, isLoadingSearchResults }) => {
  const { getInitialMovies, getMovies, movies, isLoading } = useMovies();
  const [startYear, setStartYear] = useState(2011);
  const [currentYear, setCurrentYear] = useState(2013);
  const [direction, setDirection] = useState(null);
  const [hasScrolledToInitialLoadYear, setHasScrolledToInitialLoadYear] = useState(false);
  const endYear = new Date().getFullYear();
  const containerRef = useRef(null);
  const initialLoadYear = 2012;
  const initialLoadYearRef = useRef(null);

  useEffect(() => {
    if (!isSearching && searchQuery === '') {
      const initialYears = [2011, 2012, 2013];
      getInitialMovies(initialYears, selectedGenres);
      setStartYear(2011);
      setCurrentYear(2013);
    }
  }, [selectedGenres, isSearching, searchQuery]);

  useEffect(() => {
    if (!hasScrolledToInitialLoadYear && initialLoadYearRef.current) {
      initialLoadYearRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHasScrolledToInitialLoadYear(true);
    }
  }, [movies, hasScrolledToInitialLoadYear]);

  const handleScroll = useCallback(
    debounce(() => {
      if (isLoading) return;

      const scrollTop = containerRef.current.scrollTop;
      const scrollHeight = containerRef.current.scrollHeight;
      const clientHeight = containerRef.current.clientHeight;

      if (!isSearching) {
        if (scrollTop === 0 && startYear > 1990) {
          setDirection('up');
          const newStartYear = startYear - 1;
          setStartYear(newStartYear);
          getMovies(newStartYear, selectedGenres);
        }

        if (scrollTop + clientHeight >= scrollHeight - 5 && currentYear < endYear) {
          setDirection('down');
          const newCurrentYear = currentYear + 1;
          setCurrentYear(newCurrentYear);
          getMovies(newCurrentYear, selectedGenres);
        }
      }

      if (isSearching) {
        const bottomScrollPosition = scrollHeight - clientHeight;
        const currentScrollPosition = scrollTop + 50;

        if (currentScrollPosition >= bottomScrollPosition && !isLoadingSearchResults) {
          const newSearchPage = searchPage + 1;
          onSearch(searchQuery, newSearchPage);
        }
      }
    }, 300),
    [isLoading, isSearching, startYear, currentYear, selectedGenres, searchPage, searchQuery, onSearch, isLoadingSearchResults]
  );

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const renderMovies = () => {
    if (isSearching && !isLoadingSearchResults && searchResults.length > 0) {
      return <div className='movie-year-section'>
        <div className='movie-year-card-section'>
          {searchResults.map(movie => (
            <Card key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    } else {
      return Object.keys(movies).sort((a, b) => a - b).map(year => (
        movies[year].length > 0 && <div
          key={year}
          className='movie-year-section'
          ref={year == initialLoadYear ? initialLoadYearRef : null}
        >
          <h2 className='year-heading'>{year}</h2>
          <div className='movie-year-card-section'>
            {movies[year].map(movie => (
              <Card key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      ));
    }
  }

  return <div className='list-wrapper' ref={containerRef}>
    {isLoading && direction === "up" && <>
      <Loader />
    </>}
    {renderMovies()}
    {isLoading && direction === "down" && <>
      <Loader />
    </>}
    {isLoadingSearchResults && <Loader />}
    {!isLoading && (Object.values(movies).every(movieArray => movieArray.length === 0) || (searchResults.length == 0 && isSearching && !isLoadingSearchResults)) && <p className='empty-state'>No movies found!!</p>}
  </div>
}

export default MovieList;