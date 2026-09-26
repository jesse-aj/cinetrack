require("dotenv").config({
    path: require("path").join(__dirname, "../.env")
});

const { connectDB, getMoviesCollection } = require("./db");

const movies = [
    {
        title: "Dune: Part Two",
        year: 2024,
        genre: ["Sci-Fi", "Adventure"],
        rating: 9,
        poster: "images/Dune.png",
        watched: false,
        createdAt: new Date()
    },


    {
        title: "The Shawshank Redemption",
        year: 1994,
        genre: ["Drama"],
        rating: 9,
        poster: "images/Shaw",
        watched: true,
        createdAt: new Date()
    },
    {
        title: "The Godfather",
        year: 1972,
        genre: ["Crime", "Drama"],
        rating: 10,
        poster: "images/",
        watched: false,
        createdAt: new Date()
    },
    {
        title: "Parasite",
        year: 2019,
        genre: ["Thriller", "Drama"],
        rating: 9,
        poster: "images/Parasite.png",
        watched: false,
        createdAt: new Date()
    },
    {
        title: "The Matrix",
        year: 1999,
        genre: ["Action", "Sci-Fi"],
        rating: 9,
        poster: "images/Matrix.png",
        watched: true,
        createdAt: new Date()
    },
    {
        title: "Spirited Away",
        year: 2001,
        genre: ["Animation", "Fantasy"],
        rating: 9,
        poster: "images/Spirited_Away.png",
        watched: false,
        createdAt: new Date()
    },
    {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        year: 2001,
        genre: ["Fantasy", "Adventure"],
        rating: 9,
        poster: "images/Lord_of_The_Rings.png",
        watched: true,
        createdAt: new Date()
    },
    {
        title: "Everywhere All at Once",
        year: 2022,
        genre: ["Action", "Comedy", "Sci-Fi"],
        rating: 8,
        poster: "images/Everything.png",
        watched: false,
        createdAt: new Date()
    },
    {
        title: "Whiplash",
        year: 2014,
        genre: ["Drama", "Music"],
        rating: 9,
        poster: "images/WhipSplash.png",
        watched: false,
        createdAt: new Date()
    },
    {
        title: "Mad Max: Fury Road",
        year: 2015,
        genre: ["Action", "Adventure"],
        rating: 9,
        poster: "images/MadMax.png",
        watched: true,
        createdAt: new Date()
    },
    {
        title: "Arrival",
        year: 2016,
        genre: ["Sci-Fi", "Drama"],
        rating: 8,
        poster: "images/Arrival.png",
        watched: false,
        createdAt: new Date()
    },
    {
        title: "The Grand Budapest Hotel",
        year: 2014,
        genre: ["Comedy", "Drama"],
        rating: 8,
        poster: "images/GrandBudaPest.png",
        watched: false,
        createdAt: new Date()
    },
    {
        title: "Spider-Man: Into the Spider-Verse",
        year: 2018,
        genre: ["Animation", "Action"],
        rating: 9,
        poster: "images/Spiderman.png",
        watched: true,
        createdAt: new Date()
    },
    {
        title: "Inception",
        year: 2010,
        genre: ["Sci-Fi", "Thriller"],
        rating: 9,
        poster: "images/Inception.png",
        watched: true,
        createdAt: new Date()
    },
    {
        title: "The Dark Knight",
        year: 2008,
        genre: ["Action", "Crime"],
        rating: 10,
        poster: "images/Dark_Night.png",
        watched: true,
        createdAt: new Date()
    }
];

async function seed() {
    try {
        await connectDB();

        const collection = getMoviesCollection();
        await collection.insertMany(movies);

        console.log(`${movies.length} movies inserted`);
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();