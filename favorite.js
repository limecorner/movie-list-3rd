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
        <button class="remove-from-favorite btn btn-danger" data-id="${movie.id}">X</button>
      </div>
    </div>`
  })
  movieList.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('.modal-title')
  const moviePoster = document.querySelector('.modal-body img')
  const movieDescription = document.querySelector('.modal-body #movie-description')
  const movieReleaseDate = document.querySelector('.modal-body #movie-release-date')
  axios.get(SHOW_MOVIE_URL + id)
    .then(function (response) {
      // handle success
      const movie = response.data.results
      modalTitle.innerText = movie.title
      moviePoster.src = POSTER_URL + movie.image
      movieReleaseDate.innerText = `release date: ${movie.release_date}`
      movieDescription.innerText = movie.description
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
}

movieList.addEventListener('click', e => {
  if (e.target.matches('.more')) {
    const id = e.target.dataset.id
    showMovieModal(id)
  } else if (e.target.matches('.remove-from-favorite')) {
    const id = Number(e.target.dataset.id)
    const index = favoriteMovieList.findIndex(movie => movie.id === id)
    if (index === -1) return
    favoriteMovieList.splice(index, 1)
    renderMoviesCardForm(favoriteMovieList)
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovieList))
  }
})

renderMoviesCardForm(favoriteMovieList)