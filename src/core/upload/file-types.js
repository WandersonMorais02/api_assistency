export const allowedMimeTypes = {
  images: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],

  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],

  audios: [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/webm",
    "audio/ogg",
  ],

  videos: [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
  ],
};

export function getFileCategory(mimetype) {
  if (allowedMimeTypes.images.includes(mimetype)) return "image";
  if (allowedMimeTypes.documents.includes(mimetype)) return "document";
  if (allowedMimeTypes.audios.includes(mimetype)) return "audio";
  if (allowedMimeTypes.videos.includes(mimetype)) return "video";

  return null;
}
