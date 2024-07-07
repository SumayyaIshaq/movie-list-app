import { useContext, useState } from 'react';
import RequestContext from '../Context';

const useMovies = () => {
  const [movies, setMovies] = useState({});
  const { isLoading, setIsLoading, requests, apiKey } = useContext(RequestContext);

  const getMovies = (year, append = false) => {
    if (movies.hasOwnProperty(year)) {
      return
    }
    setIsLoading(true);
    requests.get(`discover/movie?api_key=${apiKey}&sort_by=popularity.desc&primary_release_year=${year}&page=1&vote_count.gte=100`)
    .then(response => {
      const newMovies = response.data.results;
      setMovies(prevMovies => {
        const updatedMovies = { ...prevMovies };
        if (append && updatedMovies[year]) {
          updatedMovies[year] = [...updatedMovies[year], ...newMovies];
        } else {
          updatedMovies[year] = newMovies;
        }
        return updatedMovies;
      });
      setIsLoading(false);
    });
  }

  return {
    isLoading,
    movies,
    getMovies
  }
}

export default useMovies;