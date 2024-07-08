import { useEffect, useState, useCallback } from 'react';
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
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
  const requests = axios.create({ baseURL: "https://api.themoviedb.org/3/" });

  const getConfig = () => {
    requests.get(`configuration?api_key=${apiKey}`)
    .then(res => setConfig(res.data))
  }

  const getGenres = () => {
    requests.get(`genre/movie/list?language=en&api_key=${apiKey}`)
    .then(res => setGenres(res.data.genres))
  }

  const handleSearch = (query, page = 1) => {
    setSearchQuery(query);
    setSearchPage(page);
  };

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
        onSearch={handleSearch}
      />
      <MovieList 
        selectedGenres={selectedGenres} 
        searchResults={searchResults}
        isSearching={isSearching}
        searchQuery={searchQuery} 
        onSearch={handleSearch}
        searchPage={searchPage}
        isLoadingSearchResults={isLoadingSearchResults}
      />
    </div>
  </RequestContext.Provider>
}

export default App;
