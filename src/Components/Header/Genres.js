import React, { useContext } from 'react';
import RequestContext from '../../Context';

const Genres = ({ selectedGenres, setSelectedGenres }) => {
  const { genres } = useContext(RequestContext);

  const handleGenreClick = (genreId) => {
    setSelectedGenres((prevGenres) => {
      if (genreId === null) {
        return []; // Clear all selections for 'All'
      }
      if (prevGenres.includes(genreId)) {
        return prevGenres.filter((id) => id !== genreId); // Remove if already selected
      } else {
        return [...prevGenres, genreId]; // Add if not selected
      }
    });
  }

  return <div className="genres-filter">
    <ul>
      <li
        className={selectedGenres.length === 0 ? "selected" : ""}
        onClick={() => handleGenreClick(null)}
      >
        All
      </li>
      {genres.map(genre => (
        <li
          key={genre.id}
          className={selectedGenres.includes(genre.id) ? "selected" : ""}
          onClick={() => handleGenreClick(genre.id)}
        >
          {genre.name}
        </li>
      ))}
    </ul>
  </div>
}

export default Genres;