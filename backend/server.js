import { connectDB } from "./config/db.js";
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import productRoutes from "./routes/productRoutes.js";
// Get the directory name for ES Module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(
  "/altImg",
  express.static(path.join(__dirname, "public/assets/altImg"))
);

// API Routes
app.use(
  "/api",
  (req, res, next) => {
    console.log("API request received:", req.url);
    next();
  },
  productRoutes
);



app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});