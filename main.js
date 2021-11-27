const movieList = document.querySelector('#movie-list')

function renderMovieCard() {
  let rawHTML = ''

  for (let i = 0; i < 12; i++) {
    rawHTML += `<div class="card m-2" style="width: 22%;">
      <img src="https://movie-list.alphacamp.io/posters/c9XxwwhPHdaImA2f1WEfEsbhaFB.jpg" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">AntMan</h5>
      </div>
      <div class="card-footer text-muted">
        <button class="btn btn-primary">More</button>
        <button class="btn btn-info">+</button>
      </div>
    </div>`
    movieList.innerHTML = rawHTML
  }
}
renderMovieCard()