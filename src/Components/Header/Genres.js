import React, { useContext } from 'react';
import RequestContext from '../../Context';

const Genres = () => {
    const { genres } = useContext(RequestContext);

    return <div className='genres-filter'>
        <ul>
            <li>All</li>
            {genres.map(genre => <li key={genre.id}>{genre.name}</li>)}
        </ul>
    </div>
}

export default Genres;