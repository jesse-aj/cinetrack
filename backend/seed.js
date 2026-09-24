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
        poster: "",
        watched: false,
        createdAt: new Date()
    },
    {
        title: "Inception",
        year: 2010,
        genre: ["Sci-Fi", "Thriller"],
        rating: 9,
        poster: "",
        watched: true,
        createdAt: new Date()
    },
    {
        title: "The Dark Knight",
        year: 2008,
        genre: ["Action", "Crime"],
        rating: 10,
        poster: "",
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