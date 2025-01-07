import express from "express";
const app = express();
import cors from "cors";
import connectDB from "./config/db.js";
import register from "./routes/auth.js";
import Contacts from "./routes/contacts.js";

// Enable CORS for requests from http://localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//middlewares
app.use(express.json()); // Parse incoming JSON requests

//routes
app.get("/", (req, res) => {
  res.send("Hello World!"); // Root route
});

app.use("/api", register); // Authentication routes
app.use("/api/contact", Contacts); // Contact routes

const PORT = process.env.PORT || 4000;

const startserver = async () => {
  await connectDB(); // Connect to the database
  app.listen(PORT, () => {
    console.log("http://localhost:" + PORT); // Start the server
  });
};

startserver();
