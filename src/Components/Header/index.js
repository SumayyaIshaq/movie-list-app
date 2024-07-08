import React from 'react';
import Genres from './Genres';
import Search from '../../Utils/Search';

const Header = ({ selectedGenres, setSelectedGenres, onSearch }) => {
  return <header>
    <div className="header-wrapper">
      <div className='header-name-search'>
        <h2>Moviefix</h2>
        <Search onSearch={onSearch} />
      </div>
      <Genres
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      />
    </div>
  </header>
}

export default Header;