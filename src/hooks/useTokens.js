import { useState, useEffect, useCallback } from "react";
import { ShapeEnum, SizeEnum } from "../constants/Enums";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import { uuidByString, toggleNumber } from "../components/Utils";

export const useTokens = () => {
  const [tokens, setTokens] = useState(() => {
    try {
      const saved = localStorage.getItem("tokens");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [shape, setShape] = useState(() => {
    try {
      const saved = localStorage.getItem("shape");
      return saved ? JSON.parse(saved) : ShapeEnum.SQUARE;
    } catch {
      return ShapeEnum.SQUARE;
    }
  });

  const [transparentDownload, setTransparentDownload] = useState(() => {
    try {
      const saved = localStorage.getItem("transparentDownload");
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tokens", JSON.stringify(tokens));
      localStorage.setItem("shape", JSON.stringify(shape));
      localStorage.setItem("transparentDownload", JSON.stringify(transparentDownload));
    } catch (error) {
      console.error("Error saving state to localStorage:", error);
    }
  }, [tokens, shape, transparentDownload]);

  const updateTokenProperty = useCallback((token, key, value) => {
    setTokens((prevTokens) =>
      prevTokens.map((t) => (t === token ? { ...t, [key]: value } : t))
    );
  }, []);

  const updateAllTokensProperty = useCallback((key, value) => {
    setTokens((prevTokens) => prevTokens.map((t) => ({ ...t, [key]: value })));
  }, []);

  const handleAddToken = useCallback(
    (tokenUrl) => {
      if (tokens.some((token) => token.url === tokenUrl)) {
        return "This token already exists";
      }

      const newToken = {
        id: Math.random(),
        url: tokenUrl,
        size: SizeEnum.MEDIUM,
        name: "Creature",
        count: true,
        startFrom: 1,
        quantity: 1,
        showTent: true,
        showToken: true,
        showPawn: true,
      };
      setTokens((prevTokens) => [...prevTokens, newToken]);
      return undefined;
    },
    [tokens]
  );

  const removeToken = useCallback((token) => {
    setTokens((prevTokens) => prevTokens.filter((t) => t !== token));
  }, []);

  const removeAllTokens = useCallback(() => {
    setTokens([]);
  }, []);

  const downloadToken = useCallback(async (token) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = token.url;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load image"));
      });

      const canvas = document.createElement("canvas");
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      // 1. Draw Background if not transparent
      if (!transparentDownload) {
        ctx.fillStyle = "#ffffff";
        if (shape === ShapeEnum.ROUND) {
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(0, 0, size, size);
        }
      }

      // 2. Clip for Round Shape
      ctx.save();
      if (shape === ShapeEnum.ROUND) {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
        ctx.clip();
      }

      // 3. Draw Creature Image with proper aspect ratio centering
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const ratio = Math.min(size / imgWidth, size / imgHeight);
      const newWidth = imgWidth * ratio;
      const newHeight = imgHeight * ratio;
      const x = (size - newWidth) / 2;
      const y = (size - newHeight) / 2;

      ctx.drawImage(img, x, y, newWidth, newHeight);
      ctx.restore();

      // 4. Draw Premium TTRPG Gold Border
      ctx.strokeStyle = "#cfa035";
      ctx.lineWidth = 12;
      if (shape === ShapeEnum.ROUND) {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.strokeRect(6, 6, size - 12, size - 12);
      }

      // 5. Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      download(dataUrl, `${token.name}.png`, "image/png");
    } catch (error) {
      console.warn("Canvas download failed, falling back to direct URL download:", error);
      // Fallback
      const a = document.createElement("a");
      a.href = token.url;
      a.download = `${token.name}.png`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [shape, transparentDownload]);

  return {
    tokens,
    shape,
    setShape,
    transparentDownload,
    setTransparentDownload,
    handleAddToken,
    removeToken,
    removeAllTokens,
    updateTokenProperty,
    updateAllTokensProperty,
    downloadToken,
  };
};
