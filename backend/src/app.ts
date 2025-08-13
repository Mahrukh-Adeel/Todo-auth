import dotenv from 'dotenv';
import express from "express";
import todoRoutes from '../routes/todoRoutes'
import authRoutes from '../routes/authRoutes'
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200, 
}));
app.use(express.json()); 

app.get("/", (req, res) => {
  res.send("API running");
});
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
export default app;