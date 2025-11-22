// To manage PostgreSQL connection
const {Pool} = require("pg");

require("dotenv").config();

// Create a new connection pool to the PostgreSQL database
// The connection string is read from the environment variable DATABASE_URL
const pool = new Pool({connectionString:process.env.DATABASE_URL});

// Export the pool and a helper query function
// 'pool' can be used for advanced operations (transactions, etc.)
// 'query' is a helper function to easily run SQL queries with parameters
module.exports={
    pool,
    query: (text,params) => pool.query(text,params),
};