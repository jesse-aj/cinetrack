const express = require("express");
//Database Config 
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
    const movies = await collections.find({}).toArray();

    res.json(movies);
   }catch (error) {
    res.status(500).json({message: "Failed to fetch movies"})
   }
});

app.get("/api/movies/:id", async(req, res) => {   
try {
    const collection = getMoviesCollection();
    const movie = await collection.findOne({
        _id: new ObjectId(req.params.id)
    });

    if(!movie) {
        return res.status(404).json({message: "Movie not found"})
    }
    
    res.json(movie);
} catch (error) {
    res.status(400).json({ message: "Invalid movie ID"});
}
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

     if (typeof rating !== "number" || rating < 0 || rating > 10) {
        return res.status(400).json({
            message: "Rating must be a number from 0 to 10"
        });
    }


    const newMovie = {
        title,
        year,
        genre,
        rating,
        poster: poster || "",
        watched: false,
        createdAt: new Date()
    };

try {
        const collection = getMoviesCollection();
        const result = await collection.insertOne(newMovie);

        res.status(201).json({
            message: "Movie created successfully",
            movie: {
                ...newMovie,
                _id: result.insertedId
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create movie"
        });
    }
});

//Updating the movie Endpoint 
app.put("/api/movies/:id", async (req, res) => {
    const { id } = req.params; //Takes the id 
    const { watched, rating } = req.body;  // Takes the values for rating and watched from the body

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid movie ID" });
    }

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

    if (
        rating !== undefined &&
        (typeof rating !== "number" || rating < 0 || rating > 10)
    ) {
        return res.status(400).json({
            message: "Rating must be a number from 0 to 10"
        });
    }

    const updates = {};

    if (watched !== undefined) updates.watched = watched;
    if (rating !== undefined) updates.rating = rating;

    try {
        const collection = getMoviesCollection();

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        const updatedMovie = await collection.findOne({
            _id: new ObjectId(id)
        });

        res.json({
            message: "Movie updated successfully",
            movie: updatedMovie
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update movie"
        });
    }
});
 
//Deleting movie endpoint 

app.delete("/api/movies/:id", async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid movie ID"
        });
    }

    try {
        const collection = getMoviesCollection();

        const deletedMovie = await collection.findOneAndDelete({
            _id: new ObjectId(id)
        });

        if (!deletedMovie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.json({
            message: "Movie deleted successfully",
            movie: deletedMovie
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete movie"
        });
    }
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