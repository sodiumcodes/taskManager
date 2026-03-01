const client = require('../../config/imagekit');
const userModel = require('../../models/user.model');
const uploadPfp = async (req, res) => {
    try {
        async function uploadFile(buffer){
            const response = await client.files.upload({
                file: buffer.toString('base64'),
                fileName: 'image.jpg',
                folder: "/taskManager/users"
            });
        return response;
        }
        const image = await uploadFile(req.file.buffer);

        userModel.findOneAndUpdate({
            user:req.user.id
        },{
            profile_picture: image.url,
        })
        return res.status(201).json({
            message: "picture uploaded successfully"
        })

    } catch (error) {
        console.log("Image not uploaded.\n", error);
    }
}
module.exports= uploadPfp;