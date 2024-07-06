import React from 'react';
import Genres from './Genres';

const Header = () => {
	return <header>
		<div className="header-wrapper">
			<h2>Moviefix</h2>
			<Genres />
		</div>
	</header>
}

export default Header;