const apiKey = "18db5944";
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

updateFavCount();

/* ================= SEARCH ================= */
async function searchMovie() {
  const query = document.getElementById("search").value;
  const movies = document.getElementById("movies");
  const details = document.getElementById("details");

  details.innerHTML = "";
  movies.innerHTML = "Loading...";

  const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
  const data = await res.json();

  if (data.Response === "False") {
    movies.innerHTML = "Movie not found ❌";
    return;
  }

  movies.innerHTML = "";
  data.Search.forEach(movie => {
    movies.innerHTML += `
      <div class="card" onclick="showDetails('${movie.imdbID}')">
        <img src="${movie.Poster}">
        <h4>${movie.Title}</h4>
        <p>${movie.Year} | ${movie.Type}</p>
      </div>
    `;
  });
}

/* ================= DETAILS ================= */
async function showDetails(id) {
  const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
  const movie = await res.json();

  document.getElementById("movies").innerHTML = "";
  document.getElementById("details").innerHTML = `
    <div class="details-box">
      <h3>${movie.Title}</h3>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <p><strong>IMDb:</strong> ⭐ ${movie.imdbRating}</p>

      <button class="fav-btn" onclick='addToFavorites(${JSON.stringify(movie)})'>
        Add to Favorites ❤️
      </button>
      <br>
      <button class="back-btn" onclick="goBack()">Back to Search</button>
    </div>
  `;
}

/* ================= FAVORITES ================= */
function addToFavorites(movie) {
  if (!favorites.find(m => m.imdbID === movie.imdbID)) {
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavCount();
    alert("Added to favorites ❤️");
  }
}

function updateFavCount() {
  document.getElementById("favCount").innerText = `❤️ ${favorites.length}`;
}

function showFavorites() {
  const favDiv = document.getElementById("favorites");
  favDiv.innerHTML = "<h3>My Favorites</h3>";

  favorites.forEach((movie, index) => {
    favDiv.innerHTML += `
      <div class="card">
        <img src="${movie.Poster}">
        <h4>${movie.Title}</h4>
        <button onclick="removeFav(${index})">Remove ❌</button>
      </div>
    `;
  });
}

function removeFav(index) {
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavCount();
  showFavorites();
}

/* ================= BACK ================= */
function goBack() {
  document.getElementById("details").innerHTML = "";
}
