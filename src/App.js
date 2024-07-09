import { useEffect, useState } from 'react';
import axios from 'axios';
import RequestContext from './Context';
import Header from './Components/Header';
import MovieList from './Components/MovieList';
import { apiKey } from './constants';
import './App.scss';

const requests = axios.create({ baseURL: "https://api.themoviedb.org/3/" });

function App() {  
  const [config, setConfig] = useState({});
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);

  const getConfig = () => {
    requests.get(`configuration?api_key=${apiKey}`)
    .then(res => setConfig(res.data))
  }

  const getGenres = () => {
    requests.get(`genre/movie/list?language=en&api_key=${apiKey}`)
    .then(res => setGenres(res.data.genres))
  }

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      setIsLoadingSearchResults(true);
      requests.get(`search/movie?api_key=${apiKey}&query=${searchQuery}&page=${searchPage}`)
      .then(res => {
        if (res.data.results.length === 0 && searchPage > 1) {
          return;
        }
        if (searchPage === 1) {
          setSearchResults(res.data.results);
        } else {
          setSearchResults(prevResults => [...prevResults, ...res.data.results]);
        }
        setIsLoadingSearchResults(false);
      })
      .catch(() => {
        setSearchResults([]);
        setIsLoadingSearchResults(false);
      });
    } else {
      setIsSearching(false);
      setSearchResults([]);
      setSearchPage(1);
      setIsLoadingSearchResults(false);
    }
  }, [searchQuery, searchPage]);

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
        isSearching={isSearching}
        setSearchQuery={setSearchQuery}
      />
      <MovieList 
        selectedGenres={selectedGenres} 
        searchResults={searchResults}
        isSearching={isSearching}
        searchQuery={searchQuery}
        searchPage={searchPage}
        setSearchPage={setSearchPage}
        isLoadingSearchResults={isLoadingSearchResults}
      />
    </div>
  </RequestContext.Provider>
}

export default App;
