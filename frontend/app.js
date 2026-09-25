const API_URL = "http://localhost:5000";

const movieGrid = document.getElementById("movie-grid");   //Works on the movie grid container using DOM
const modalDetails = document.getElementById("modal-movie-details") //Allows work on the modal pop up screen(Details)
const movieModal = document.getElementById("movie-modal"); //Allows work on the actual modal pop up screen
const closeModalBtn = document.getElementById("close-modal-btn"); //Allows us to add a close button to the modal when opened 

//local Storage stores string so we  have to queue as JSON
const QUEUE_KEY = "cinetrack_queue";

// Load saved movie IDs when the page starts
let queueIds = JSON.parse(
    localStorage.getItem(QUEUE_KEY) || "[]"
);

// Save the current movie IDs to this browser
function saveQueue() {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queueIds));
}


// Render the queue using the latest movie data from the API
function renderTonightQueue(movies) {
    const queueContainer = document.getElementById("tonights-queue");

    // Match saved localStorage IDs with movies returned by MongoDB
    const queuedMovies = queueIds
        .map(id => movies.find(movie => movie._id === id))
        .filter(Boolean);

    // Remove IDs whose movies no longer exist in MongoDB
    queueIds = queuedMovies.map(movie => movie._id);
    saveQueue();

    if (queuedMovies.length === 0) {
        queueContainer.innerHTML = "<p>Your queue is empty.</p>";
        return;
    }

    queueContainer.innerHTML = queuedMovies.map(movie => `
        <article class="queue-card" data-id="${movie._id}">
            <h3>${movie.title}</h3>
            <p>${movie.year} · ${movie.genre.join(", ")}</p>
            <button class="remove-queue-btn">
                Remove
            </button>
        </article>
    `).join("");

    // Remove a movie immediately from localStorage and the panel
    queueContainer
        .querySelectorAll(".remove-queue-btn")
        .forEach(button => {
            button.addEventListener("click", () => {
                const queueCard = button.closest(".queue-card");
                const movieId = queueCard.dataset.id;

                queueIds = queueIds.filter(id => id !== movieId);
                saveQueue();

                // Re-render immediately without refreshing the page
                renderTonightQueue(movies);
            });
        });
}


//Loads the movie for the frontend to use 
async function loadMovies() {
    try {
        const response = await fetch(`${API_URL}/api/movies`);

        if (!response.ok) {    //If the response is not OK then ..
            throw new Error("Failed to load movies");
        }

        const movies = await response.json(); //Wait for response from the server 

        // Remove old cards before rendering fresh database data
        movieGrid.innerHTML = "";

        if (movies.length === 0) {
            movieGrid.textContent = "No movies found.";
            return;
        }


        renderMovies(movies);
        // Render the queue using the latest movie data from the API
        renderTonightQueue(movies);

    } catch (error) {
        console.error(error);
        movieGrid.textContent = "Could not load movies.";
    }
}

loadMovies();

function renderMovies(movies) {
    movies.forEach(movie => {
        //create a fresh card div element 
        const card = document.createElement("div");
        card.className = "card";
        //This assigns an id to each card
        card.dataset.id = movie._id;


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
        <div class="buttons">
        <button class = "queue-btn">Add to Tonight</button>
        <button class="fav-btn"> Favorite </button>
        <button class="add-lib">Add to library</button>
        <button class="mark-watched">Mark watched</button>
        <button class="edit-btn">Edit </button>
        <button class="delete-btn">Delete</button>
        </div>

        </div>
    `;

// Add or remove this movie's ID from the browser queue
const queueBtn = card.querySelector(".queue-btn");

const isQueued = queueIds.includes(movie._id);

queueBtn.textContent = isQueued
    ? "Remove from Tonight"
    : "Add to Tonight";

queueBtn.addEventListener("click", event => {
    event.stopPropagation();

    if (queueIds.includes(movie._id)) {
        // Remove the movie ID from the queue
        queueIds = queueIds.filter(id => id !== movie._id);
    } else {
        // Store only the MongoDB ID, not the whole movie object
        queueIds.push(movie._id);
    }

    // Persist the changed IDs in this browser
    saveQueue();

    // Update this button
    queueBtn.textContent = queueIds.includes(movie._id)
        ? "Remove from Tonight"
        : "Add to Tonight";

    // Update the queue panel
    renderTonightQueue(movies);
});

    //Favorite button interaction
    const favBtn = card.querySelector(".fav-btn");
    favBtn.addEventListener("click", (e) => { 
        e.stopPropagation(); // Prevents clicking the button from accidentally opening the modal screen
        favBtn.classList.toggle("active");
        favBtn.textContent = favBtn.classList.contains("active") ? "♡ " : "🤍";
    });

    //Add library button 
    const addlib = card.querySelector(".add-lib");
    addlib.addEventListener("click", (e) => {
        e.stopPropagation();
    addlib.classList.toggle("selected");
    addlib.textContent = addlib.classList.contains("selected")
    ?"＋"
    :"✓";
    })

// Mark a movie as watched or unwatched in MongoDB
    const watchedBtn = card.querySelector(".mark-watched");

       // Show the current database state
    watchedBtn.textContent = movie.watched 
                             ? "Unwatch" : "Mark watched";
    watchedBtn.classList.toggle("selected", movie.watched);

    watchedBtn.addEventListener("click", async (event) => {
    event.stopPropagation();


    // Reverse the current watched value
    const newWatchedValue = !movie.watched;

    try {
        const response = await fetch(`${API_URL}/api/movies/${movie._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                watched: newWatchedValue
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Could not update movie");
        }

        // Update the local movie after MongoDB succeeds
        movie.watched = newWatchedValue;

        watchedBtn.classList.toggle("selected", movie.watched);
        watchedBtn.textContent = movie.watched
            ? "Unwatch"
            : "Mark watched";
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

    //Edit button 
    const editBtn = card.querySelector(".edit-btn");
    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
    editBtn.classList.toggle("selected");
    editBtn.textContent = editBtn.classList.contains("selected")
            ? "Edit"
            : "Undo Edit";
    });


// Delete the movie from MongoDB
const deleteBtn = card.querySelector(".delete-btn");

deleteBtn.addEventListener("click", async (event) => {
    event.stopPropagation();

    const confirmed = confirm(`Delete "${movie.title}"?`);

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/movies/${movie._id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Could not delete movie");
        }

        // Also remove the deleted movie from the local queue
        queueIds = queueIds.filter(id => id !== movie._id);
        saveQueue();

        // Reload cards from MongoDB after successful deletion
        await loadMovies();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});



//Allows the modal to open when the card id clicked on 
    card.addEventListener("click", () => {
        const clickedId = card.dataset.id; //Turns the string to text
        const selectedMovie = movies.find(movie => movie._id === clickedId); //Allows to select each card based on the id(Finds the selected card by id)
        if (selectedMovie) {
            modalDetails.innerHTML = `
            <h2>${selectedMovie.title}</h2>
            <p class="modal-year">Released: ${selectedMovie.year}</p>
            <p class="modal-rating">${selectedMovie.rating}/10</p>
    `; 
    movieModal.classList.add("open");  //Allows the model to pop up when selected 
    }});


    //Push the newly constructed card into the layout grid
    movieGrid.appendChild(card);
    });
}

//Handles the close button
closeModalBtn.addEventListener("click", () => {
    movieModal.classList.remove("open");
});
    

const movieForm = document.getElementById("movie-form");

movieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const movie = {
        title: document.getElementById("title").value,
        year: Number(document.getElementById("year").value),
        genre: document
            .getElementById("genre")
            .value
            .split(",")
            .map(item => item.trim()),
        rating: Number(document.getElementById("rating").value),
        poster: document.getElementById("poster").value
    };

    const response = await fetch(`${API_URL}/api/movies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(movie)
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.message);
        return;
    }

    alert("Movie added successfully");
    movieForm.reset();
    movieGrid.innerHTML = "";
    loadMovies();
});