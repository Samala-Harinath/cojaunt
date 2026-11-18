/**
 * Photo upload, done safely in the browser.
 *
 * Every photo is decoded and redrawn onto a canvas, then saved as a new JPEG. That does three things:
 * - only real, decodable images get through (a renamed file or a script fails to decode),
 * - EXIF metadata is dropped, including GPS location, which phones often embed,
 * - the file is shrunk so it fits in browser storage.
 *
 * PROTOTYPE: photos are stored in localStorage. A backend must re-check type and size, scan for nudity,
 * violence and faces of minors, compare the face with the selfie check, and store files privately.
 */
export const MAX_PHOTOS = 6;

const MAX_BYTES = 10 * 1024 * 1024;
const MIN_EDGE = 200;
const LONG_EDGE = 800;
const QUALITY = 0.8;
/** SVG is left out on purpose: it can carry scripts. */
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export const photoAccept = TYPES.join(",");

export async function preparePhoto(file: File): Promise<string> {
  if (!TYPES.includes(file.type)) throw new Error("Use a JPG, PNG or WebP photo.");
  if (file.size > MAX_BYTES) throw new Error("That photo is over 10 MB. Try a smaller one.");

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("That file couldn’t be opened as a photo.");
  }

  try {
    if (bitmap.width < MIN_EDGE || bitmap.height < MIN_EDGE) throw new Error("That photo is too small. Use one at least 200 pixels wide.");
    const scale = Math.min(1, LONG_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser couldn’t process that photo.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", QUALITY);
  } finally {
    bitmap.close();
  }
}

/** Only re-encoded JPEGs made by preparePhoto are ever rendered, so nothing else saved in storage can sneak in as a photo. */
export function isSafePhoto(src: string): boolean {
  return src.startsWith("data:image/jpeg;base64,");
}
