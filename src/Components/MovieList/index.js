import React, { useEffect, useState, useRef } from 'react';
import useMovies from '../../Hooks/useMovies';
import Card from './Card';
import Loader from '../../Utils/Loader';
import ShimmerCardList from '../../Utils/ShimmerCardList';

const MovieList = () => {
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
    const initialYears = [2011, 2012, 2013];
    getInitialMovies(initialYears);
  }, []);

	useEffect(() => {
    if (!hasScrolledToInitialLoadYear && initialLoadYearRef.current) {
      initialLoadYearRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
			setHasScrolledToInitialLoadYear(true);
    }
  }, [movies, hasScrolledToInitialLoadYear]);

	const handleScroll = () => {
		if (isLoading) return;
	
		const scrollTop = containerRef.current.scrollTop;
		const scrollHeight = containerRef.current.scrollHeight;
		const clientHeight = containerRef.current.clientHeight;

		if (scrollTop <= 10 && startYear > 1990) {
			setDirection('up');
			const newStartYear = startYear - 1;
		  setStartYear(newStartYear);
			getMovies(newStartYear);
		}
	
		if (scrollTop + clientHeight >= scrollHeight - 5 && currentYear < endYear) {
		  setDirection('down');
			const newCurrentYear = currentYear + 1;
			setCurrentYear(newCurrentYear);
		  getMovies(newCurrentYear);
		}
	}

	useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [startYear, currentYear, isLoading]);

	return <div className='list-wrapper' ref={containerRef}>
		{isLoading && direction === "up" && <>
			<Loader />
			<ShimmerCardList />
		</>}
		{Object.keys(movies).sort((a, b) => a - b).map(year => (
			<div key={year} className='movie-year-section' ref={year == initialLoadYear ? initialLoadYearRef : null}>
				<h2 className='year-heading'>{year}</h2>
				<div className='movie-year-card-section'>
					{movies[year].map(movie => (
						<Card key={movie.id} movie={movie} />
					))}
				</div>
			</div>
		))}
    {isLoading && direction === "down" && <>
			<Loader />
			<ShimmerCardList />
		</>}
    {!isLoading && !Object.keys(movies).length && <p>No movies found</p>}
	</div>
}

export default MovieList;