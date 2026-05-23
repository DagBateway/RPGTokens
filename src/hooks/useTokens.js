import { useState, useEffect, useCallback } from "react";
import { ShapeEnum, SizeEnum } from "../constants/Enums";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import { uuidByString, toggleNumber } from "../components/Utils";
import { useTranslation } from "./useTranslation";

export const useTokens = () => {
  const { t } = useTranslation();
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

  useEffect(() => {
    try {
      localStorage.setItem("tokens", JSON.stringify(tokens));
      localStorage.setItem("shape", JSON.stringify(shape));
    } catch (error) {
      console.error("Error saving state to localStorage:", error);
    }
  }, [tokens, shape]);

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
        return "errorExists";
      }

      let derivedName = t("defaultTokenName");
      try {
        if (tokenUrl && !tokenUrl.startsWith("data:")) {
          const decodedUrl = decodeURIComponent(tokenUrl);
          const cleanUrl = decodedUrl.split(/[?#]/)[0];
          const cleanPath = cleanUrl.replace(/\/+$/, "");
          const lastSegment = cleanPath.substring(cleanPath.lastIndexOf("/") + 1);
          
          if (lastSegment) {
            const dotIndex = lastSegment.lastIndexOf(".");
            let nameWithoutExt = dotIndex > 0 ? lastSegment.substring(0, dotIndex) : lastSegment;
            nameWithoutExt = nameWithoutExt.replace(/[-_]+/g, " ").trim();
            if (nameWithoutExt) {
              derivedName = nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1);
            }
          }
        }
      } catch (error) {
        console.error("Error parsing filename from URL:", error);
      }

      const newToken = {
        id: Math.random(),
        url: tokenUrl,
        size: SizeEnum.MEDIUM,
        name: derivedName,
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
    [tokens, t]
  );

  const removeToken = useCallback((token) => {
    setTokens((prevTokens) => prevTokens.filter((t) => t !== token));
  }, []);

  const removeAllTokens = useCallback(() => {
    setTokens([]);
  }, []);

  const downloadToken = useCallback(async (token) => {
    try {
      const tokenElement = document.getElementById(uuidByString(token.url));
      toggleNumber(tokenElement, "hidden");

      const dataUrl = await htmlToImage.toPng(tokenElement);
      download(dataUrl, `${token.name}.png`);
    } catch (error) {
      console.error("Error downloading token:", error);
    } finally {
      const tokenElement = document.getElementById(uuidByString(token.url));
      toggleNumber(tokenElement, "visible");
    }
  }, []);

  return {
    tokens,
    shape,
    setShape,
    handleAddToken,
    removeToken,
    removeAllTokens,
    updateTokenProperty,
    updateAllTokensProperty,
    downloadToken,
  };
};
