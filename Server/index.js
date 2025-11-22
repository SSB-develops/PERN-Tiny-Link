const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const linkRoutes = require("../Server/routes/LinkRoutes");
const LinkController = require("../Server/controllers/LinkControllers");
const db = require("./config/db");
require("dotenv").config();

// Initialize Express app
const app = express();
// Adds security-related HTTP headers
app.use(helmet());
// Enable CORS for all origins
app.use(cors());
// Parse incoming JSON request bodies
app.use(express.json());

// Health check endpoint
// This route can be used to check if the server is running and healthy
app.get("/healthz", (req, res) => {
  res.status(200).json({
    ok: true,
    version: "1.0",
    uptime: process.uptime(), // in seconds
    timestamp: new Date().toISOString(),
  });
});

// All routes under "/api/links" will be handled by linkRoutes
app.use("/api/links", linkRoutes);

// Redirect route
app.get("/:code", LinkController.redirect);

// Define server port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Function to start the server and verify DB connection
async function startServer() {
  try {
    console.log("Connecting to Neon PostgreSQL...");

    // Test database connection by executing a simple query
    const result = await db.pool.query("SELECT NOW()");
    console.log("Neon DB connected at:", result.rows[0].now);

    // Start the Express server after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Neon database connection failed");
    console.error(err);
    process.exit(1);
  }
}

// Call startServer to initialize DB connection and start the server
startServer();
