const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const connectDB     = require("./config/db")
const path          = require("path")

require('dotenv').config()

connectDB();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname+"/public")))
app.use("/api/auth",require("./router/auth"))
app.use("/api/recovery", require("./router/recovery"))
app.use("/api/dashboard",require("./router/dashboard"))
app.use("/api/account", require("./router/account"))
app.use("/api/products", require("./router/products"))
app.use("/api/buy", require("./router/buy"))
app.use("/api/messages", require("./router/messages"))



app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})