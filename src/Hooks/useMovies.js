import { useContext, useState } from 'react';
import RequestContext from '../Context';

const useMovies = () => {
  const [movies, setMovies] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { requests, apiKey } = useContext(RequestContext);

  const getMovies = async (year, selectedGenres = [], page = 1) => {
    setIsLoading(true);
    try {
      const genreParam = selectedGenres.length > 0 ? `&with_genres=${selectedGenres.join(',')}` : '';
      const response = await requests.get(`discover/movie?api_key=${apiKey}&sort_by=popularity.desc&primary_release_year=${year}&page=${page}&vote_count.gte=100${genreParam}`);
      setMovies(prevMovies => ({
        ...prevMovies,
        [year]: page === 1 ? response.data.results : [...prevMovies[year], ...response.data.results]
      }));
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
    setIsLoading(false);
  }

  return {
    isLoading,
    movies,
    getMovies
  }
}

export default useMovies;