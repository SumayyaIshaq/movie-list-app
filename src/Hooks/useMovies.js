import { useContext, useState } from 'react';
import RequestContext from '../Context';

const useMovies = () => {
  const [movies, setMovies] = useState({});
  const { isLoading, setIsLoading, requests, apiKey } = useContext(RequestContext);

  const getInitialMovies = (years) => {
    setIsLoading(true);
    const moviePromises = years.map(year =>
      requests.get(`discover/movie?api_key=${apiKey}&sort_by=popularity.desc&primary_release_year=${year}&page=1&vote_count.gte=100`)
    );

    Promise.all(moviePromises)
    .then(responses => {
      const moviesByYear = responses.reduce((acc, response, index) => {
        const year = years[index];
        acc[year] = response.data.results;
        return acc;
      }, {});
      setMovies(prevMovies => ({ ...prevMovies, ...moviesByYear }));
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching movies:', error);
      setIsLoading(false);
    });
  }

  const getMovies = (year) => {
    setIsLoading(true);
    requests.get(`discover/movie?api_key=${apiKey}&sort_by=popularity.desc&primary_release_year=${year}&page=1&vote_count.gte=100`)
      .then(response => {
        setMovies(prevMovies => ({
          ...prevMovies,
          [year]: [...(prevMovies[year] || []), ...response.data.results]
        }));
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setIsLoading(false);
      });
  }

  return {
    isLoading,
    movies,
    getInitialMovies,
    getMovies
  }
}

export default useMovies;