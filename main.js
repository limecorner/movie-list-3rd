const BASE_URL = 'https://movie-list.alphacamp.io/api/v1/'
const ALL_MOVIES_URL = BASE_URL + 'movies'
const SHOW_MOVIE_URL = BASE_URL + 'movies/'
const POSTER_URL = 'https://movie-list.alphacamp.io/posters/'
const movieList = document.querySelector('#movie-list')
const movies = []

// Search (variable)
const searchForm = document.querySelector('#search-form')

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

function addToFavorite(id) {
  let favoriteMovieList = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  if (favoriteMovieList.some(movie => movie.id === id)) return
  const movie = movies.find(movie => movie.id === id)
  favoriteMovieList.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovieList))
}

movieList.addEventListener('click', e => {
  if (e.target.matches('.more')) {
    const id = e.target.dataset.id
    showMovieModal(id)
  } else if (e.target.matches('.add-to-favorite')) {
    const id = Number(e.target.dataset.id)
    addToFavorite(id)
  }
})

searchForm.addEventListener('submit', () => {
  event.preventDefault()
  const input = document.querySelector('#input')
  const keyword = input.value.toLowerCase().trim()
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(keyword)
  )
  if (!filteredMovies.length) {
    return alert(`搜尋不到${keyword}`)
  }
  renderMoviesCardForm(filteredMovies)
})



axios.get(ALL_MOVIES_URL)
  .then(function (response) {
    // handle success
    movies.push(...response.data.results)
    renderMoviesCardForm(movies)
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
