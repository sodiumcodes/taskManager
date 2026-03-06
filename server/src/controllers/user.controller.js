const client = require('../../config/imagekit');
const userModel = require('../../models/user.model');
const uploadPfp = async (req, res) => {
    try {
        async function uploadFile(buffer) {
            const response = await client.files.upload({
                file: buffer.toString('base64'),
                fileName: 'image.jpg',
                folder: "/taskManager/users"
            });
            return response;
        }
        const image = await uploadFile(req.file.buffer);

        const user = await userModel.findOneAndUpdate({
            _id: req.user.id
        }, {
            profile_picture: image.url,
        })
        return res.status(201).json({
            message: "picture uploaded successfully",
            user
        })

    } catch (error) {
        console.log("Image not uploaded.\n", error);
        return res.status(500).json({
            message: "Image not uploaded",
            error
        })
    }
}
const phone = async(req, res) =>{
    try{
        const user = await userModel.findOneAndUpdate({
            _id: req.user.id
        }, {
            phone : req.body.phone
        })
        return res.status(201).json({
            message: "phone no. added successfully",
            user
        })
    }
    catch(error){
        console.log("Phone no. not added.\n", error);
        return res.status(500).json({
            message: "Phone no. not added",
            error
        })
    }
}

module.exports = {uploadPfp, phone};