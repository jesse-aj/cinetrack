const movies = [
    {title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: "8.8", poster: ""},
    {title: "Moana", year: 2014, genre: "Sci-Fi", rating: "8.8", poster: ""},
    {title: "Jesse", year: 2032, genre: "Anime", rating: "8.8", poster: ""},
    {title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: "8.8", poster: ""},
    {title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: "8.8", poster: ""},
    {title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: "8.8", poster: ""},
    {title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: "8.8", poster: ""},
    {title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: "8.8", poster: ""}

]

const movieGrid = document.getElementById("movie-grid");

movies.forEach(movie => {
    //create a fresh card div element 
    const card = document.createElement("div");
    card.className = "card";

  //insert the template filled with the current movie's data
  card.innerHTML = `
    <img src="${movie.poster}" alt="${movie.title} Poster" class="card-poster">
    <div class="card-content">
      <h3 class="card-title">${movie.title}</h3>
      <div class="card-meta">
        <span class="year">${movie.year}</span> • 
        <span class="genre">${movie.genre}</span>
      </div>
      <div class="card-rating">${movie.rating}/10</div>
    </div>
    <button class="fav-btn">🤍 Favorite</button>

  `;

  // Push the newly constructed card into the layout grid
  movieGrid.appendChild(card);
});

