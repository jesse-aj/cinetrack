const movieGrid = document.getElementById("movie-grid");   //Works on the movie grid container using DOM
const modalDetails = document.getElementById("modal-movie-details") //Allows work on the modal pop up screen(Details)
const movieModal = document.getElementById("movie-modal"); //Allows work on the actual modal pop up screen
const closeModalBtn = document.getElementById("close-modal-btn"); //Allows us to add a close button to the modal when opened 
const tonightQueue = [];

//Loads the movie for the frontend to use 
async function loadMovies() {
    try {
        const response = await fetch("http://localhost:5000/api/movies");

        if (!response.ok) { //If the response is not OK then ..
            throw new Error("Failed to load movies");
        }

        const movies = await response.json(); //Wait for response from the server 

        renderMovies(movies);
    } catch (error) {
        console.error(error);
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

    //Tonoghts Queue section 
    const queueBtn = card.querySelector(".queue-btn");
    queueBtn.addEventListener("click", (event) => {
        event.stopPropagation();

        const alreadyQueued = tonightQueue.some(
            queuedMovie => queuedMovie._id === movie._id
        );

        if (!alreadyQueued) {
            tonightQueue.push(movie);
            renderTonightQueue();
        }
    });

    // Rendering the queue
    function renderTonightQueue(){
        const queueContainer = document.getElementById("tonights-queue");
        queueContainer.innerHTML = tonightQueue.map(movie =>
            `<div class = "queue-card">
            <img class="queue-poster" src="${movie.poster}" alt="${movie.title} poster">
            <h3>${movie.title}</h3>
            <p>${movie.year} . ${movie.genre} </p>
            </div>`
        ).join("")
    }

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
    ?"＋📚"
    :"✓📚";
    })

    //Mark as watched button
    const watchedbtn = card.querySelector(".mark-watched");
    watchedbtn.addEventListener("click", (e) => {
        e.stopPropagation();
    watchedbtn.classList.toggle("selected");
    watchedbtn.textContent = watchedbtn.classList.contains("selected")
            ? "✓"
            : "↺";
    });

    //Edit button 
    const editBtn = card.querySelector(".edit-btn");
    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
    editBtn.classList.toggle("selected");
    editBtn.textContent = editBtn.classList.contains("selected")
            ? "✏️"
            : "↩️";
    });

    //Delete button 
    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.add("removed");
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
    