import { v2 as cloudinary } from "cloudinary"
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from 'fs'; // Import fs for file deletion

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        return response;
    } catch (error) {
        if (localFilePath) {
            fs.unlinkSync(localFilePath); // unlink the localFilePath as the uploading process failed
        }
        console.log("Failed to upload the file on Cloudinary:", error);
        return null;
    }
}

export const uploadImage = asyncHandler(async(req, res) => {
    const profileImageLocalPath = await req.file?.path;    
    try {
        const profileImageUrl = await uploadOnCloudinary(profileImageLocalPath);
        if (!profileImageUrl) {
            throw new ApiError(400, "Failed to upload on Cloudinary");
        }
        return res.status(200).json(profileImageUrl); // Corrected response handling
    } catch (error) {
        console.log("Error:", error);
        throw new ApiError(400, error.message || "Failed to upload image on Cloudinary"); // Corrected error handling
    }
})