require("dotenv").config();
const fs = require("fs");
const {Pool} =  require("pg");

(async function() {
    // Read SQL migration file (e.g., creating tables and indexes)
    const sql = fs.readFileSync(__dirname + "/migrations.sql", "utf8");

    // Create a PostgreSQL connection pool using DATABASE_URL from .env
    const pool = new Pool({connectionString: process.env.DATABASE_URL});

    try {
        // Execute the SQL commands in the migration file
        await pool.query(sql);
        console.log("Migrations applied successfully");
    } catch (error) {
        console.log("Migration failed", error);
        process.exit(1);
        
    }finally{
         // Close the database connection pool
        await pool.end();
    }

    
})();