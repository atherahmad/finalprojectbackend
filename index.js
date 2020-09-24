const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const connectDB = require("./config/db");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const { urlencoded } = require("body-parser");

connectDB();

app.use(urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + "/public")));

app.use(cors());

app.use("/api/auth", require("./router/auth"));
app.use("/api/recovery", require("./router/recovery"));
app.use("/api/dashboard", require("./router/dashboard"));
app.use("/api/account", require("./router/account"));
app.use("/api/products", require("./router/products"));
app.use("/api/buy", require("./router/buy"));
app.use("/api/contact", require("./router/contact"));
app.use("/api/messages", require("./router/messages"));
app.use("/api/messages", require("./router/messages"));
app.use("/api/admin", require("./router/admin"));
app.use("/api/uploads", require("./router/uploads"));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
