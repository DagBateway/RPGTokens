import getUuidByString from "uuid-by-string";

/**
 * Generates a UUID from a string.
 * @param {string} str - Input string.
 * @returns {string} - Generated UUID.
 */
export const uuidByString = (str) => getUuidByString(str);

/**
 * Encodes a string to base64 with Unicode support.
 * @param {string} str - Input string.
 * @returns {string} - Base64 encoded string.
 */
export const base64EncodeUnicode = (str) => {
  try {
    const utf8Bytes = encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      (match, p1) => String.fromCharCode("0x" + p1)
    );
    return btoa(utf8Bytes);
  } catch (error) {
    console.error("Error encoding to base64:", error);
    return null;
  }
};

/**
 * Toggles visibility of elements with the class 'number' inside a given node.
 * @param {HTMLElement} node - Parent node.
 * @param {string} visibility - Visibility value ('visible' or 'hidden').
 */
export const toggleNumber = (node, visibility) => {
  if (!node || typeof visibility !== "string") {
    console.warn("Invalid arguments for toggleNumber.");
    return;
  }

  const numberElements = node.querySelectorAll(".number");
  numberElements.forEach((item) => {
    item.style.visibility = visibility;
  });
};

/**
 * Wraps external URLs in a CORS-enabling image proxy (images.weserv.nl).
 * This ensures external images bypass CORS restrictions, preventing canvas tainting during download.
 * @param {string} url - Input URL.
 * @returns {string} - Proxied URL or original if local/data URL.
 */
export const getCorsProxiedUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (url.startsWith("/") || url.startsWith("http://localhost") || url.startsWith("https://localhost") || url.startsWith("127.0.0.1")) return url;
  
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
};

/**
 * Resizes and compresses an image file on the client side, returning a promise resolving to a base64 Data URL.
 * Preserves transparency for PNGs and compresses JPEGs.
 * @param {File} file - Selected image file.
 * @param {number} maxWidth - Maximum width (default 256).
 * @param {number} maxHeight - Maximum height (default 256).
 * @param {number} quality - Compression quality between 0.0 and 1.0 (default 0.8).
 * @returns {Promise<string>} - Promise resolving to base64 string.
 */
export const resizeAndCompressImage = (file, maxWidth = 256, maxHeight = 256, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => {
        reject(new Error("Failed to load image: " + err.message));
      };
    };
    reader.onerror = (err) => {
      reject(new Error("Failed to read file: " + err.message));
    };
    reader.readAsDataURL(file);
  });
};

