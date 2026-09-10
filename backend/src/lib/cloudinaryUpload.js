import cloudinary from "./cloudinary.js";
import { Readable } from "stream";

export function uploadToCloudinary(buffer, folder) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        Readable.from(buffer).pipe(uploadStream);
    });
}