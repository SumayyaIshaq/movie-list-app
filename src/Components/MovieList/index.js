import React, { useEffect, useState } from 'react';
import useMovies from '../../Hooks/useMovies';
import Card from './Card';

const MovieList = () => {
	const { getMovies, movies } = useMovies();
	const [year, setYear] = useState(2012);

	useEffect(() => {
		getMovies(year)
	}, []);

	return <div className='list-wrapper'>
		{movies.map(movie => {
			return <Card 
				key={movie.id} 
				movie={movie} 
			/>
		})}
	</div>
}

export default MovieList;