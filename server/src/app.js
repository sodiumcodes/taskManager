const express = require("express")
const postRouter = require("./routes/post.routes")
const authRouter = require("./routes/auth.routes")
const app = express();

//Built in middlewares
app.use(express.json());
app.use(express.urlencoded());


app.use('/task', postRouter)
app.use('/auth', authRouter)

module.exports = app;