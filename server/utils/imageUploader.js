const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file, folder, width, height) => {
    try {
        const options = { folder };
        if (width && height) {
            options.width = width;
            options.height = height;
            options.crop = "fill";
        }

        const result = await cloudinary.uploader.upload(file, options);
        return result;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};

exports.deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Image deleted from Cloudinary:", result);
        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        throw error;
    }
};