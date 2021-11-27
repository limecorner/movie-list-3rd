const BASE_URL = 'https://movie-list.alphacamp.io/api/v1/'
const ALL_MOVIES_URL = BASE_URL + 'movies'
const movieList = document.querySelector('#movie-list')

function renderMovieCard(movies) {
  let rawHTML = ''
  movies.forEach(movie => {
    rawHTML += `<div class="card m-2" style="width: 22%;">
      <img src="https://movie-list.alphacamp.io/posters/${movie.image}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
      </div>
      <div class="card-footer text-muted">
        <button class="btn btn-primary">More</button>
        <button class="btn btn-info">+</button>
      </div>
    </div>`
    movieList.innerHTML = rawHTML
  })
}

axios.get(ALL_MOVIES_URL)
  .then(function (response) {
    // handle success
    const movies = response.data.results
    renderMovieCard(movies)
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
