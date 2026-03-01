import express from "express";
import routes from "./routes";

const app = express();
app.use(express.json());

app.use("/", routes);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});