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
module.exports = uploadPfp;