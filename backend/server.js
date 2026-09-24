const express = require("express");
const movies = require("./models/movieModels");
require("dotenv").config({
    path: require("path").join(__dirname, "../.env")
});

const { connectDB, getMoviesCollection } = require("./db");
const { ObjectId } = require("mongodb");


const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "API is running"
    });
});

app.get("/api/movies", async(req, res) => {
   try {
    const collections = getMoviesCollection();
    const movies = await.collections.find({}).toArray();

    res.json(movies);
   }catch (error) {
    res.status(500).json({message: "Failed to fetch movies"})
   }
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


app.delete("/api/movies/:id", async(req, res) => {
    // Get the movie ID from the URL and convert it from text to a number.
    const movieId = Number(req.params.id);
    // Find the array position of the movie with this ID.
    const movieIndex = movies.findIndex(movie => movie.id === movieId);

    // findIndex returns -1 when no movie has the requested ID.
    if (movieIndex === -1) {
        return res.status(404).json({ message: "Movie not found" });
    }

    // Remove one movie at that position and keep the removed movie.
    const deletedMovie = movies.splice(movieIndex, 1)[0];

    // Tell the client that the deletion succeeded and return the deleted movie.
    res.json({
        message: "Movie deleted successfully",
        movie: deletedMovie
    });
});

connectDB()
    .then(() => {
        app.listen(5000, () => {
            console.log("Server running on port 5000");
        });
    })
    .catch(error => {
        console.error("MongoDB connection failed:", error);
    });