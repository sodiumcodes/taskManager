require("dotenv").config()
require("colors")
const app = require("./src/app.js")
const Connection = require("./config/db.js")
const mongoose = require("mongoose")

let server;

async function startServer(){

    try{
        console.log("Starting server".yellow)
        await Connection()
        server = app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`.green)
        })
    }
    catch(error){
        console.log('Error while starting the server'.red, error)
    }
}

const stopServer = async () => {
    try{
        console.log("\nStopping server".yellow)
        await mongoose.disconnect()
        console.log("Database connection closed".bgRed.white)
        server.close(() => {
            console.log("Server stopped".bgRed.white)
            process.exit(0)
        })
    }
    catch(error){
        console.log("Error while stopping the server".red, error)
        process.exit(1)
    }
}

process.on("SIGINT", stopServer)
process.on("SIGTERM", stopServer)

startServer()