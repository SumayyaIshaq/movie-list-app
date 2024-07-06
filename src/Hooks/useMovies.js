import { useContext, useState } from 'react';
import RequestContext from '../Context';

const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const {isLoading, setIsLoading, requests, apiKey} = useContext(RequestContext);

  const getMovies = (year) => {
    setIsLoading(true);
    requests.get(`discover/movie?api_key=${apiKey}&sort_by=popularity.desc&primary_release_year=${year}&page=1&vote_count.gte=100`)
    .then(response => {
      setMovies(response.data.results);
      setIsLoading(false);
    })
  }

  return {
    isLoading,
    movies,
    getMovies
  }
}

export default useMovies;