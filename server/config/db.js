import mongoose from 'mongoose'
const Connection = mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("Database Connection Established.");  
})
export default Connection;