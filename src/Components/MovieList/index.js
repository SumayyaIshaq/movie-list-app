import React, { useEffect, useState, useRef, useCallback } from 'react';
import useMovies from '../../Hooks/useMovies';
import Card from './Card';
import Loader from '../../Utils/Loader';
import debounce from '../../Utils/debounce';

const MovieList = ({ selectedGenres, searchQuery, searchResults, isSearching, searchPage, setSearchPage, isLoadingSearchResults }) => {
  const { getMovies, movies, isLoading } = useMovies();
  const [years] = useState([2011, 2012, 2013]);
  const [startYear, setStartYear] = useState(2011);
  const [currentYear, setCurrentYear] = useState(2013);
  const [endYear] = useState(new Date().getFullYear());
  const [direction, setDirection] = useState(null);
  const [hasScrolledToInitialLoadYear, setHasScrolledToInitialLoadYear] = useState(false);
  const containerRef = useRef(null);
  const initialLoadYear = 2012;
  const initialLoadYearRef = useRef(null);

  useEffect(() => {
    if (!isSearching && searchQuery === '') {
      years.forEach(year => getMovies(year, selectedGenres));
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
      if (isLoading || isLoadingSearchResults) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      if (!isSearching && searchQuery === '') {
        if (scrollTop === 0 && startYear > 1990) {
          setDirection('up');
          const newStartYear = startYear - 1;
          setStartYear(newStartYear);
          fetchAndPrependMovies(newStartYear); //To prevent layout shifting when more movies are loaded and prepended
        }

        if (scrollTop + clientHeight >= scrollHeight - 10 && currentYear < endYear) {
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
          setSearchPage(newSearchPage);
        }
      }
    }, 300),
    [isLoadingSearchResults, isSearching, searchPage, setSearchPage]
  );

  const fetchAndPrependMovies = async (year) => {
    const container = containerRef.current;
    const prevScrollHeight = container.scrollHeight;

    await getMovies(year, selectedGenres, 1);

    const newScrollHeight = container.scrollHeight;
    container.scrollTop = newScrollHeight - prevScrollHeight;
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const renderMovies = () => {
    if (isSearching) {
      if (!isLoadingSearchResults) {
        if (searchResults.length > 0) {
          return <div className='movie-year-section'>
            <div className='movie-year-card-section'>
              {searchResults.map(movie => (
                <Card key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        } else {
          return <p className='empty-state'>No movies found!!</p>
        }
      }
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

  return <div className='list-wrapper' ref={containerRef}>{console.log("searchResults: ", searchResults)}
    {isLoading && direction === "up" && <>
      <Loader />
    </>}
    {renderMovies()}
    {isLoading && direction === "down" && <>
      <Loader />
    </>}
    {isSearching && isLoadingSearchResults && <Loader />}
    {!isLoading && Object.values(movies).every(movieArray => movieArray.length === 0) && <p className='empty-state'>No movies found!!</p>}
  </div>
}

export default MovieList;