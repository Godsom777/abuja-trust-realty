import { compressImage } from './imageCompression';
import { supabase } from './supabase';

/**
 * Optimizes a Cloudinary delivery URL with on-the-fly transformations (f_auto, q_auto).
 * Automatically delivers modern formats (WebP/AVIF for images, optimized codecs for video).
 *
 * @param {string} url - Original Cloudinary URL
 * @param {Object} [options]
 * @param {string} [options.transformations] - Custom transformation string, defaults to 'f_auto,q_auto'
 * @returns {string} Optimized URL
 */
export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url;
  }

  // Avoid duplicate injection
  if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) {
    return url;
  }

  const defaultTransform = 'f_auto,q_auto';
  const transform = options.transformations || defaultTransform;

  // Insert transformations right after /upload/
  return url.replace('/upload/', `/upload/${transform}/`);
}

/**
 * Generates an instant video thumbnail poster image from a Cloudinary video URL.
 * Grabs the initial frame (start offset 0s) and optimizes it as JPEG.
 *
 * @param {string} videoUrl
 * @returns {string|null}
 */
export function getVideoPosterUrl(videoUrl) {
  if (!videoUrl || typeof videoUrl !== 'string') return null;

  if (videoUrl.includes('cloudinary.com') && videoUrl.includes('/video/upload/')) {
    return videoUrl
      .replace('/video/upload/', '/video/upload/so_0,f_jpg,q_auto/')
      .replace(/\.[^/.]+$/, '.jpg');
  }

  return null;
}

/**
 * Helper to identify whether a URL or File is a video.
 *
 * @param {string|File} target
 * @returns {boolean}
 */
export function isVideoMedia(target) {
  if (!target) return false;

  if (typeof target === 'string') {
    return (
      target.endsWith('.mp4') ||
      target.endsWith('.webm') ||
      target.endsWith('.mov') ||
      target.endsWith('.m4v') ||
      target.includes('/video/upload/') ||
      target.includes('video')
    );
  }

  if (target instanceof File || (typeof target === 'object' && target.type)) {
    return (
      target.type.startsWith('video/') ||
      Boolean(target.name && target.name.match(/\.(mp4|webm|mov|m4v|avi|mkv)$/i))
    );
  }

  return false;
}

/**
 * Uploads an image or video file directly from the browser.
 * Priority:
 *   1. Cloudinary via Unsigned Preset (Direct upload, no serverless file limits, real-time progress)
 *   2. Supabase Storage fallback (if Cloudinary keys are missing or upload fails)
 *
 * @param {File} file - File object from file input
 * @param {Object} [options]
 * @param {string} [options.folder] - Folder destination (e.g. 'properties')
 * @param {Function} [options.onProgress] - Callback: ({ percent, loaded, total }) => void
 * @returns {Promise<{ url: string, isVideo: boolean, posterUrl: string|null, provider: 'cloudinary'|'supabase' }>}
 */
export async function uploadMediaFile(file, options = {}) {
  if (!file) throw new Error("No file provided for upload.");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const isVideo = isVideoMedia(file);

  // Pre-process images: client-side compress to save bandwidth/upload time
  let processedFile = file;
  if (!isVideo) {
    try {
      processedFile = await compressImage(file);
    } catch (compressErr) {
      console.warn("Client-side image compression skipped, uploading original:", compressErr);
      processedFile = file;
    }
  }

  // ─── 1. Attempt Direct Cloudinary Upload ───
  if (cloudName && uploadPreset) {
    try {
      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? 'video' : 'image'}/upload`;

      const formData = new FormData();
      formData.append('file', processedFile);
      formData.append('upload_preset', uploadPreset);
      if (options.folder) {
        formData.append('folder', options.folder);
      }

      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint, true);

        // Upload progress tracking
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && typeof options.onProgress === 'function') {
            const percent = Math.round((e.loaded / e.total) * 100);
            options.onProgress({ percent, loaded: e.loaded, total: e.total });
          }
        });

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve(res);
            } catch (err) {
              reject(new Error("Invalid JSON response from Cloudinary."));
            }
          } else {
            let errorMsg = `Cloudinary upload failed (HTTP ${xhr.status})`;
            try {
              const errRes = JSON.parse(xhr.responseText);
              if (errRes.error?.message) {
                errorMsg = `Cloudinary: ${errRes.error.message}`;
              }
            } catch (_) {}
            reject(new Error(errorMsg));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during Cloudinary upload."));
        xhr.ontimeout = () => reject(new Error("Cloudinary upload timed out."));

        xhr.send(formData);
      });

      const secureUrl = result.secure_url || result.url;
      const optimizedUrl = optimizeCloudinaryUrl(secureUrl);
      const posterUrl = isVideo ? getVideoPosterUrl(optimizedUrl) : null;

      return {
        url: optimizedUrl,
        isVideo: isVideo,
        posterUrl,
        provider: 'cloudinary'
      };
    } catch (cloudinaryError) {
      console.warn("Cloudinary upload failed, attempting Supabase Storage fallback:", cloudinaryError);
      // Fall through to Supabase fallback below
    }
  }

  // ─── 2. Fallback to Supabase Storage ───
  const fileExt = processedFile.name.split('.').pop() || (isVideo ? 'mp4' : 'webp');
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const prefix = isVideo ? 'video-' : 'photo-';
  const filePath = `${options.folder ? `${options.folder}/` : ''}${prefix}${fileName}`;

  const { data, error } = await supabase.storage
    .from('property-media')
    .upload(filePath, processedFile, {
      cacheControl: '31536000, public',
      upsert: false
    });

  if (error) {
    throw new Error(`Media storage upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('property-media')
    .getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    isVideo: isVideo,
    posterUrl: null,
    provider: 'supabase'
  };
}
