import express from "express";
import { initDB } from "./db/initDB.js";
import dotenv from 'dotenv';
import adminRoutes from "./routes/adminRoutes.js"

dotenv.config();

const app = express();
const PORT = 8080 

// Middleware for parsing JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize the database
initDB();

app.use("/api/admin",adminRoutes)

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is listening on port: ${PORT}`);
});
