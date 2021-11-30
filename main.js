const BASE_URL = 'https://movie-list.alphacamp.io/api/v1/'
const ALL_MOVIES_URL = BASE_URL + 'movies'
const SHOW_MOVIE_URL = BASE_URL + 'movies/'
const POSTER_URL = 'https://movie-list.alphacamp.io/posters/'
const movieList = document.querySelector('#movie-list')
const movies = []

// Search (variable)
const searchForm = document.querySelector('#search-form')
// Pages (variable)
const MOVIES_PER_PAGE = 12
const pagination = document.querySelector('.pagination')
let filteredMovies = []

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
  filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(keyword)
  )
  if (!filteredMovies.length) {
    return alert(`搜尋不到${keyword}`)
  }
  renderMoviesCardForm(getMoviesByPage(1))
  renderPages(filteredMovies.length)
})

function renderPages(numbersOfMovies) {
  const totalpages = Math.ceil(numbersOfMovies / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= totalpages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" data-page="${page}" href="#">${page}</a></li>`
  }
  pagination.innerHTML = rawHTML
}

function getMoviesByPage(page) { //render movie統一用
  const selectedMovies = (filteredMovies.length) ? filteredMovies : movies
  const start = (page - 1) * 12
  const moviesByPage = selectedMovies.slice(start, start + MOVIES_PER_PAGE)
  return moviesByPage
}

pagination.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    const page = Number(e.target.dataset.page)
    renderMoviesCardForm(getMoviesByPage(page))
  }
})

axios.get(ALL_MOVIES_URL)
  .then(function (response) {
    // handle success
    movies.push(...response.data.results)
    renderMoviesCardForm(getMoviesByPage(1))
    renderPages(movies.length)
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
