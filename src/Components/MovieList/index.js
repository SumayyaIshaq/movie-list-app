import React, { useEffect, useState, useRef } from 'react';
import useMovies from '../../Hooks/useMovies';
import Card from './Card';
import Loader from '../../Utils/Loader';

const MovieList = () => {
	const { getMovies, movies, isLoading } = useMovies();
	const [year, setYear] = useState(2012);
	const [direction, setDirection] = useState(null);
	const containerRef = useRef(null);
	const currentYear = new Date().getFullYear()

	useEffect(() => {
		const initialYear = 2012;

		if (year === initialYear || year === currentYear) {
			return getMovies(year)
		}
		getMovies(year, true) 
	}, [year]);

	const handleScroll = () => {
		if (isLoading) return;
	
		const scrollTop = containerRef.current.scrollTop;
		const scrollHeight = containerRef.current.scrollHeight;
		const clientHeight = containerRef.current.clientHeight;
	
		if (scrollTop === 0 && year > 2000) {
		  setDirection('up');
		  setYear(prevYear => prevYear - 1);
		}
	
		if (scrollTop + clientHeight >= scrollHeight && year < currentYear) {
		  setDirection('down');
		  setYear(prevYear => prevYear + 1);
		}
	};

	useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [year, isLoading]);

	return <div className='list-wrapper' ref={containerRef}>
		{isLoading && direction === "up" && <Loader />}
		{Object.keys(movies).sort((a, b) => a - b).map(year => (
			<div key={year} className='movie-year-section'>
				<h2 className='year-heading'>{year}</h2>
				<div className='movie-year-card-section'>
					{movies[year].map(movie => (
						<Card key={movie.id} movie={movie} />
					))}
				</div>
			</div>
    ))}
    {isLoading && direction === "down" && <Loader />}
    {!isLoading && !Object.keys(movies).length && <p>No movies found</p>}
	</div>
}

export default MovieList;