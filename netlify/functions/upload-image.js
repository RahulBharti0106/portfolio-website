// netlify/functions/upload-image.js
// POST /api/upload-image
// Protected - requires JWT token
// Body: { image: base64string, folder: 'avatars' | 'banners' }

const { verifyToken, ok, error, handleOptions } = require('./_auth');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions();
  if (event.httpMethod !== 'POST') return error('Method not allowed', 405);

  // Protected - must be logged in
  const auth = verifyToken(event);
  if (!auth.valid) return auth.response;

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return error('Cloudinary credentials not configured', 500);
  }

  try {
    const { image, folder = 'portfolio' } = JSON.parse(event.body);

    if (!image) return error('No image provided', 400);

    // Validate it's actually a base64 image
    if (!image.startsWith('data:image/')) {
      return error('Invalid image format', 400);
    }

    // Check size — base64 is ~33% larger than actual file
    // 5MB file = ~6.7MB base64 string
    const sizeInBytes = (image.length * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    if (sizeInMB > 7) {
      return error('Image too large. Maximum size is 5MB', 400);
    }

    // Upload to Cloudinary via their REST API
    // No SDK needed - keeps the function lightweight
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Create signature for authenticated upload
    const timestamp = Math.round(Date.now() / 1000);
    const crypto = require('crypto');

    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha256')
      .update(paramsToSign + apiSecret)
      .digest('hex');

    // Build form data as URL-encoded string
    const formData = new URLSearchParams({
      file: image,
      folder: folder,
      timestamp: timestamp.toString(),
      api_key: apiKey,
      signature: signature,
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Cloudinary error:', result);
      return error(result.error?.message || 'Upload failed', 500);
    }

    return ok({
      url: result.secure_url,
      public_id: result.public_id,
    });

  } catch (err) {
    console.error('upload-image error:', err);
    return error('Upload failed: ' + err.message);
  }
};