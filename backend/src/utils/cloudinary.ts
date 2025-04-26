import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log Cloudinary config (without sensitive data)
console.log('Cloudinary Config:', {
  cloud_name_set: !!process.env.CLOUDINARY_CLOUD_NAME,
  api_key_set: !!process.env.CLOUDINARY_API_KEY,
  api_secret_set: !!process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage to handle file buffers
const storage = multer.memoryStorage();

// Multer upload middleware
export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Upload image buffer to Cloudinary
export const uploadImage = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'forumx', transformation: [{ width: 1000, height: 1000, crop: 'limit' }] },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary upload error:', error);
          reject(error || new Error('Upload failed'));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    // Write file buffer to Cloudinary stream
    stream.end(file.buffer);
  });
};

// Upload an audio file to Cloudinary
export const uploadAudio = async (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'forumx', resource_type: 'video', transformation: [{ width: 1000, height: 1000, crop: 'limit' }] },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary audio upload error:', error);
          reject(error || new Error('Upload failed'));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(file.buffer);
  });
};

// Delete an image from Cloudinary
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from the URL
    const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.uploader.destroy(`forumx/${publicId}`);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
};

export const deleteCloudinaryAsset = async (publicId: string): Promise<boolean> => {
  try {
    await cloudinary.uploader.destroy(`forumx/${publicId}`);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

export default cloudinary; 