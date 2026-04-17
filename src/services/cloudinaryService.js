// src/services/cloudinaryService.js
import { CLOUDINARY_CONFIG } from '../utils/constants';

/**
 * Upload a file (image or PDF) from the device to Cloudinary.
 *
 * @param {object} file  - { uri, name, type } from DocumentPicker / ImagePicker
 * @param {function} onProgress - optional (0-100) callback
 * @returns {Promise<{url, publicId, format, resourceType}>}
 */
export const uploadFile = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name || `upload_${Date.now()}`,
      type: file.type || 'application/octet-stream',
    });
    formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
    formData.append('resource_type', 'auto'); // handles images + PDFs

    const xhr = new XMLHttpRequest();
    xhr.open('POST', CLOUDINARY_CONFIG.API_URL, true);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
          format: data.format,
          resourceType: data.resource_type,
          bytes: data.bytes,
          createdAt: data.created_at,
        });
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
};

/**
 * Upload a file from a remote URL to Cloudinary.
 * Cloudinary fetches the file itself (no local download needed).
 *
 * @param {string} remoteUrl
 * @returns {Promise<{url, publicId, format, resourceType}>}
 */
export const uploadFromUrl = async (remoteUrl) => {
  const formData = new FormData();
  formData.append('file', remoteUrl);
  formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
  formData.append('resource_type', 'auto');

  const response = await fetch(CLOUDINARY_CONFIG.API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Cloudinary URL upload failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    format: data.format,
    resourceType: data.resource_type,
    bytes: data.bytes,
    createdAt: data.created_at,
  };
};
