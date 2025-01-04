import express from "express";
const app = express();
import cors from "cors";
import connectDB from "./config/db.js";
import register from "./routes/auth.js";
import Contacts from "./routes/contacts.js";
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//middlewares
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", register);
app.use("/api", Contacts);

const PORT = process.env.PORT || 4000;

const startserver = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log("http://localhost:" + PORT);
  });
};
startserver();
