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
