const { MongoClient } = require("mongodb");

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from the .env file");
}


const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
    await client.connect();
    db = client.db("cinetrack");
    console.log("Connected to MongoDB");
}

function getMoviesCollection() {
    return db.collection("movies");
}

module.exports = {
    connectDB,
    getMoviesCollection
};