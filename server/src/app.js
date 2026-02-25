const express = require("express")
const postRouter = require("./routes/post.routes")
const app = express();

//Built in middlewares
app.use(express.json());
app.use(express.urlencoded());


app.use('/task', postRouter)

module.exports = app;