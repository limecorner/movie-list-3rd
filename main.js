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

// 新增變數
const controlFormat = document.querySelector('#control-format')
let currentFormat = 'card-format'
let currentPage = 1

// render movie方式1: 卡片模式
function renderMoviesByCardFormat(movies) {
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

// render movie方式2: 清單模式
// 新增function
function renderMovieByListFormat(data) {
  let rawHTML = `<table class="table">
        <tbody>
          <tr>
            <th scope="row"></th>
            <td></td>
          </tr>`
  data.forEach(item => {
    rawHTML += `
      <tr>
        <th scope="row">${item.title}</th>
        <td class="d-flex justify-content-end">
          <button type="button" class="btn btn-primary btn-show-movie mx-2" data-bs-toggle="modal"
            data-bs-target="#modal" data-id="${item.id}">
            More
          </button>
          <a href="#" class="btn btn-info add-to-favorite" data-id="${item.id}">+</a>
        </td>
      </tr>
    `
  })
  rawHTML += `
        </tbody>
      </table>`
  movieList.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('.modal-title')
  const moviePoster = document.querySelector('.modal-body img')
  const movieDescription = document.querySelector('.modal-body #movie-description')
  const movieReleaseDate = document.querySelector('.modal-body #movie-release-date')
  modalTitle.innerText = ''
  moviePoster.src = ''
  movieReleaseDate.innerText = ''
  movieDescription.innerText = ''
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
  currentPage = 1
  renderMovieByFormat(currentPage)
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
    currentPage = Number(e.target.dataset.page)
    renderMovieByFormat(currentPage)
  }
})

// 新增function: 
// 1.根據目前模式是 '卡片or清單'，用 '卡片or清單' 渲染電影
// 2.根據傳進來的頁數，決定渲染第幾頁
function renderMovieByFormat(page) {
  if (currentFormat === 'card-format') {
    renderMoviesByCardFormat(getMoviesByPage(page))
  } else if (currentFormat === 'list-format') {
    renderMovieByListFormat(getMoviesByPage(page))
  }
}

// 新增監聽器: 
// 1.點擊卡片圖式->currentFormat='card-format'
//   點擊清單圖式->currentFormat='list-format'
// 2.根據currentFormat渲染頁面
controlFormat.addEventListener('click', (e) => {
  currentFormat = e.target.id
  renderMovieByFormat(currentPage)
})

axios.get(ALL_MOVIES_URL)
  .then(function (response) {
    // handle success
    movies.push(...response.data.results)
    renderMovieByFormat(currentPage)
    renderPages(movies.length)
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
