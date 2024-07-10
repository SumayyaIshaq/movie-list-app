# Project - Movie List App

## Steps to run project

### `npm i`
To install the required node modules

### `npm start`
Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Node version
\>12

## Requirements covered

- Layout and UI
    - Created custom UI components using React
    - Display a list of movies sorted in descending order of popularity
    - Show the movie title, image, genre, and a short description related to the movie in each information card. (Shown on hover of each card)

- Default page load state
    - Load a total of only 20 movies for each year
    - By default, when a user lands on the page, display a list of movies of the year 2012
    - Implement smooth scrolling behavior to load more movies as the user scrolls in any direction i.e load movies of previous year when user scrolls up and load movies of next year when user scrolls down until the current year.

- Genre Filter
    - Provided a filter UI that allows users to filter movies by genre.
    - When a user selects one or more genres, the list should only display movies of the selected genres.

- Bonus Requirements (Optional)
    - Ensure smooth scrolling even when more and more movies are loaded in the DOM.
    - Implemented a search bar which searches for the movie based on the search string and displays an infinite loading list of movies which matches the search.

## Requirements not covered

- Implement this project in React Native instead of a web app (Optional)
- Use TypeScript for enhanced type safety and code quality. (Optional)
