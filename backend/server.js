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
        return res.staus(400).json({
            message: "Title, year, genre and rating are required"
        });
    }

    if (typeof title !=="string" || typeof year !== "number") {
        return res.json(400).json({
            message: "Title must be a text and year must be a number" 
        });
    }

    if (!Array.isArray(genre)) {
        return res.status(400).json({
            message: "Genre must be an array"
        });



})




app.listen(5000, () => {
	console.log("Server running on port 5000");
});