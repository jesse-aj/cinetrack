const movies = [
    {title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: "8.8", poster: "", watched: true},
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
    //This assigns an id to each card
    card.dataset.id = movie.id;

    const clickedId = Number(card.dataset.id); //Turns the string to text
    const selectedMovies = movies.find(movie => movie.id === clickedId);

    const modalDetails = document.getElementById("modal-movie-detail")

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
      <button class="fav-btn"> Favorite</button>

    </div>
  `;

const favBtn = card.querySelector(".fav-btn");

favBtn.addEventListener("click", () => {
    
  // Toggle a CSS class on the button
  favBtn.classList.toggle("active");

// Update the button text depending on its state
  if (favBtn.classList.contains("active")) {
    favBtn.textContent = "Favorited";
  } else {
    favBtn.textContent = "Favorite";
  }
});

  // Push the newly constructed card into the layout grid
  movieGrid.appendChild(card);
});


