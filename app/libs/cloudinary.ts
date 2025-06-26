import { CLOUDINARY_URI } from "@/constants/api";

export const uploadToCloudinary = async (base64Img: string) => {

  const data = {
    file: base64Img,
    upload_preset: 'hookitup',
  };

  try {
    const res = await fetch(CLOUDINARY_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      return result.secure_url;
    } else {
      console.error('Upload failed:', result);
      throw new Error(result.error?.message || 'Upload failed');
    }
  } catch (err) {
    console.error('Upload error:', err);
    throw err;
  }
};
