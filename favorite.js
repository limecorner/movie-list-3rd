const BASE_URL = 'https://movie-list.alphacamp.io/api/v1/'
const SHOW_MOVIE_URL = BASE_URL + 'movies/'
const POSTER_URL = 'https://movie-list.alphacamp.io/posters/'
const movieList = document.querySelector('#movie-list')
// add movies to favorite movies (variable)
const favoriteMovieList = JSON.parse(localStorage.getItem('favoriteMovies')) || []

function renderMoviesCardForm(movies) {
  let rawHTML = ''
  movies.forEach(movie => {
    rawHTML += `<div class="card m-2" style="width: 22%;">
      <img src="${POSTER_URL}${movie.image}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
      </div>
      <div class="card-footer text-muted">
        <button class="more btn btn-primary" data-bs-toggle="modal" data-bs-target="#movieModal" data-id="${movie.id}">More</button>
        <button class="add-to-favorite btn btn-info" data-id="${movie.id}">+</button>
      </div>
    </div>`
  })
  movieList.innerHTML = rawHTML
}

renderMoviesCardForm(favoriteMovieList)