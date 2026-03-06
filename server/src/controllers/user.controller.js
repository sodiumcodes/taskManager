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
const phone = async (req, res) => {
    try {
        const user = await userModel.findOneAndUpdate({
            _id: req.user.id
        }, {
            phone: req.body.phone
        })
        return res.status(201).json({
            message: "phone no. added successfully",
            user
        })
    }
    catch (error) {
        console.log("Phone no. not added.\n", error);
        return res.status(500).json({
            message: "Phone no. not added",
            error
        })
    }
}

async function getuserDetails(req, res) {
    try {
        if (!req.user.id) {
            return res.status(401).json({
                message: "User not authenticated"
            })
        }
        const user = await userModel.findById(req.user.id).select("-password")
        const status = await taskModel.aggregate([
            { $match: { user: req.user.id } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])
        return res.status(200).json({
            message: "User details fetched successfully",
            user,
            status
        })
    }
    catch (error) {
        console.log("User details not fetched.\n", error);
        return res.status(500).json({
            message: "User details not fetched",
            error
        })
    }
}

async function updateName(req, res) {
    try {
        const user = await userModel.findOneAndUpdate({
            _id: req.user.id
        }, {
            name: req.body.name
        })
        return res.status(201).json({
            message: "name updated successfully",
            user
        })
    }
    catch (error) {
        console.log("name not updated.\n", error);
        return res.status(500).json({
            message: "name not updated",
            error
        })
    }
}
module.exports = { uploadPfp, phone, getuserDetails, updateName };