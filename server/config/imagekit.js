//for files (images) we use CLOUD STORAGE PROVIDERS , one such CSP is imageKit.io
const ImageKit = require('@imagekit/nodejs'); 
const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

module.exports = client;