import { useContext, useState } from 'react';
import RequestContext from '../Context';

const useMovies = () => {
  const [movies, setMovies] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { requests, apiKey } = useContext(RequestContext);

  const getInitialMovies = (years, genreIds = []) => {
    setIsLoading(true);
    const genreQuery = genreIds.length ? `&with_genres=${genreIds.join(',')}` : '';
    const requestsArray = years.map(year =>
      requests.get(`discover/movie?api_key=${apiKey}&sort_by=popularity.desc&primary_release_year=${year}&page=1&vote_count.gte=100${genreQuery}`)
    );

    Promise.all(requestsArray)
    .then(responses => {
      const moviesByYear = responses.reduce((acc, response, index) => {
        const year = years[index];
        acc[year] = response.data.results;
        return acc;
      }, {});
      setMovies(moviesByYear);
      setIsLoading(false);
    })
  }

  const getMovies = (year, genreIds = []) => {
    setIsLoading(true);
    const genreQuery = genreIds.length ? `&with_genres=${genreIds.join(',')}` : '';
    requests.get(`discover/movie?api_key=${apiKey}&sort_by=popularity.desc&primary_release_year=${year}&page=1&vote_count.gte=100${genreQuery}`)
      .then(response => {
        setMovies(prevMovies => ({
          ...prevMovies,
          [year]: [...(prevMovies[year] || []), ...response.data.results]
        }));
        setIsLoading(false);
      })
  }

  return {
    isLoading,
    movies,
    getInitialMovies,
    getMovies
  }
}

export default useMovies;