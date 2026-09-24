const { MongoClient } = require("mongodb");

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