index.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Movie Search & Favorites App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Title -->
  <h2>🎬 Movie Search</h2>

  <!-- Top Search Bar -->
  <div class="top-bar">
    <input type="text" id="search" placeholder="Search movie by title">
    <button onclick="searchMovie()">Search</button>
    <span id="favCount">❤️ 0</span>
  </div>

  <!-- Movie Search Results -->
  <div id="movies"></div>

  <!-- Movie Details Section -->
  <div id="details"></div>

  <!-- Favorites Section -->
  <div id="favorites"></div>

  <!-- JavaScript -->
  <script src="script.js"></script>

</body>
</html>
style.css
/* ===== GLOBAL STYLES ===== */
body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #141e30, #243b55);
    color: #fff;
    padding: 20px;
    min-height: 100vh;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
    letter-spacing: 1px;
  }
  
  /* ===== SEARCH BAR ===== */
  input {
    padding: 10px;
    width: 260px;
    max-width: 80%;
    border: none;
    border-radius: 4px;
    outline: none;
  }
  
  button {
    padding: 10px 15px;
    margin-left: 5px;
    border: none;
    border-radius: 4px;
    background: #ff4757;
    color: white;
    cursor: pointer;
    transition: 0.3s;
  }
  
  button:hover {
    background: #ff6b81;
  }
  
  /* ===== MOVIE GRID ===== */
  #movies {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    margin-top: 30px;
  }
  
  /* ===== MOVIE CARD ===== */
  .card {
    background: #ffffff;
    color: #333;
    border-radius: 10px;
    padding: 12px;
    text-align: center;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
  }
  
  /* ===== MOVIE POSTER ===== */
  .card img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 6px;
  }
  
  /* ===== MOVIE TEXT ===== */
  .card h4 {
    margin: 10px 0 5px;
    font-size: 16px;
  }
  
  .card p {
    font-size: 14px;
    color: #777;
  }
  
  .top-bar {
    text-align: center;
    margin-bottom: 20px;
  }
  
  #favCount {
    background: #ff4757;
    padding: 6px 12px;
    border-radius: 20px;
    margin-left: 10px;
    font-size: 14px;
  }
  
  .details-box {
    background: white;
    color: #333;
    padding: 20px;
    border-radius: 10px;
    margin-top: 20px;
  }
  
  .fav-btn {
    background: #2ed573;
    margin-top: 8px;
  }
  
  .back-btn {
    background: #1e90ff;
    margin-top: 10px;
  }


script.js


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

















