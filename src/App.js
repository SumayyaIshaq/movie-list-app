import { useEffect, useState } from 'react';
import axios from 'axios';
import RequestContext from './Context';
import Header from './Components/Header';
import MovieList from './Components/MovieList';
import './App.scss';

function App() {
  const apiKey = '2dca580c2a14b55200e784d157207b4d';
  const [config, setConfig] = useState({});
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const requests = axios.create({ baseURL: "https://api.themoviedb.org/3/" });

  const getConfig = () => {
    requests.get(`configuration?api_key=${apiKey}`)
    .then(res => setConfig(res.data))
  }

  const getGenres = () => {
    requests.get(`genre/movie/list?language=en&api_key=${apiKey}`)
    .then(res => setGenres(res.data.genres))
  }

  useEffect(() => {
    getConfig()
    getGenres()
  }, [])

  return <RequestContext.Provider
    value={{
      axios,
      requests,
      apiKey,
      config,
      genres,
    }}
  >
    <div className="main-app-container">
      <Header
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      />
      <MovieList selectedGenres={selectedGenres} />
    </div>
  </RequestContext.Provider>
}

export default App;
