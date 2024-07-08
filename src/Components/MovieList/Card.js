import React, { useContext, useMemo } from 'react';
import RequestContext from '../../Context';
import PlaceholderPoster from '../../assets/poster_placeholder.jpg'

const Card = ({movie}) => {
  const { config, genres } = useContext(RequestContext);
  const imgBaseUrl = config.images.base_url;
  const posterSize = 'w342';

  const genreMap = useMemo(() => {
    return genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  }, [genres]);

  const getGenre = (id) => genreMap[id] || 'Unknown';

  return <div className="movie-card">
    <div className='movie-card-poster-wrapper'>
      <img 
        className='movie-card-poster' 
        src={movie.poster_path ? `${imgBaseUrl}${posterSize}/${movie.poster_path}` : PlaceholderPoster} 
        alt={`${movie.title} poster`}
      />
    </div>
    <div className='movie-card-info-wrapper'>
      <h5 className='movie-card-title'>{movie.title}</h5>
      <div className='movie-card-genres'>
        <ul>
          {movie.genre_ids.slice(0,2).map(id => <li key={id}>{getGenre(id)}</li>)}
        </ul>
      </div>
      <p className='movie-card-desc'>{movie.overview}</p>
    </div>
  </div>
}

export default Card;