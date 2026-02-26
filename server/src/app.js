const express = require("express")
const postRouter = require("./routes/task.routes")
const authRouter = require("./routes/auth.routes")
const morgan = require("morgan")
const cors = require("cors")
const app = express();

//Built in middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))
app.use(morgan("dev"))


app.use('/task', postRouter)
app.use('/auth', authRouter)


module.exports = app;