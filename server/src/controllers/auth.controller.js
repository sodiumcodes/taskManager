const userModel = require("../../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("../../config/jwt")

async function register(req, res){

    try{

        //Collect data
        const {name, email, password} = req.body;
        
        //Validate data
        if(!name || !email || !password){
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        
        //Check if user already exists
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            })
        }
        
        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        //Create user
        const user = await userModel.create({
            name, email, password: hashedPassword
        });
        
        //send response
        res.status(201).json({
            message: "User registered",
            user
        });
    } catch (err) {
        res.status(500).json({
            message: "Error registering user",
            error: err.message
        });
    }
        
}

async function login(req, res){
    try {
        //Collect data
        const {email, password} = req.body;

        //Validate data
        if(!email || !password){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        //Check if user exists
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        //Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        //Generate token
        const token = jwt.generateToken({id: user._id, email: user.email});
        res.cookie("token", token)

        //send response
        res.status(200).json({
            message: "Login successful",
            user
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error logging in",
            error: err.message
        });
    }
}

module.exports = {
    register,
    login
}