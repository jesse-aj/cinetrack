const express = require("express");
const movies = require("./models/movieModels");
const app = express();
app.use(express.json());

app.get("/api/movies", async(req, res) => {
	res.json(movies)
});

app.get("/api/movies/:id", async(req, res) => {   
    const movieId = Number(req.params.id);
    const movie = movies.find(movie => 
                         movie.id === movieId);

    if(!movie) {
        return res.status(404).json({message: "Movie not found"})
    }
    
    res.json(movie);
});


app.post("/api/movies", async(req, res) => {
    const {title, year, genre, rating, poster } = req.body

    if (!title || !year || !genre || rating === undefined){
        return res.status(400).json({
            message: "Title, year, genre and rating are required"
        });
    }

    if (typeof title !=="string" || typeof year !== "number") {
        return res.status(400).json({
            message: "Title must be a text and year must be a number" 
        });
    }

    if (!Array.isArray(genre)) {
        return res.status(400).json({
            message: "Genre must be an array"
        });
    }

    const newMovie = {
        id: movies.length + 1,
        title,
        year,
        genre,
        rating,
        poster: poster || "",
        watched: false
    };

    movies.push(newMovie)

    res.status(201).json({
        message: "Movie created successfully",
        movie: newMovie
    });

});


app.put("/api/movies/:id", async(req, res) => {
    const movieId = Number(req.params.id)
   const movie = movies.find(movie => movie.id === movieId )

   if(!movie)
    return res.status(400).json({message: "Movie cannot be found"})

    const { watched, rating } = req.body;

    if (watched === undefined && rating === undefined) {
        return res.status(400).json({
            message: "Provide watched or rating to update"
        });
    }

    if (watched !== undefined && typeof watched !== "boolean") {
        return res.status(400).json({
            message: "Watched must be true or false"
        });
    }

    if (rating !== undefined && (typeof rating !== "number" || rating < 0 || rating > 10)) {
        return res.status(400).json({
            message: "Rating must be a number from 0 to 10"
        });
    }

    if (watched !== undefined) {
        movie.watched = watched;
    }

    if (rating !== undefined) {
        movie.rating = rating;
    }

    res.json({
        message: "Movie updated successfully",
        movie
    });
})



app.listen(5000, () => {
	console.log("Server running on port 5000");
});