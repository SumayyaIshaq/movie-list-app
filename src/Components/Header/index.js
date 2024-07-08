import React from 'react';
import Genres from './Genres';

const Header = ({ selectedGenres, setSelectedGenres }) => {
  return <header>
    <div className="header-wrapper">
      <h2>Moviefix</h2>
      <Genres
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      />
    </div>
  </header>
}

export default Header;