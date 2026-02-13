"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("No file uploaded");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: "blush-build" },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                } else {
                    resolve(result?.secure_url || "");
                }
            }
        ).end(buffer);
    });
}
