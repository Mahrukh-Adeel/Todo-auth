import express from "express";
import connectDB from "../config/database";
import app from "./app"

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
});