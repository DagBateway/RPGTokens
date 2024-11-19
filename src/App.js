import React, { useState, useEffect } from "react";
import { ShapeEnum, SizeEnum } from "./constants/Enums";
import { AddToken } from "./components/AddToken";
import { Table } from "./components/Table";
import { Shape } from "./components/Shape";
import { Tokens } from "./components/Tokens";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import { uuidByString, toggleNumber } from "./components/Utils";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const App = () => {
  const [tokens, setTokens] = useState([]);
  const [shape, setShape] = useState(ShapeEnum.SQUARE);

  // Firebase and Local Storage Initialisation
  useEffect(() => {
    try {
      const firebaseConfig = {
        apiKey: "AIzaSyA_9cM7P47m1mc-oo4dxJqmJ2w8ljYgCzI",
        authDomain: "paper-tokens.firebaseapp.com",
        databaseURL: "https://paper-tokens.firebaseio.com",
        projectId: "paper-tokens",
        storageBucket: "paper-tokens.appspot.com",
        messagingSenderId: "953191343724",
        appId: "1:953191343724:web:c72b746baf099f07905a49",
        measurementId: "G-DRHE0C7GJH",
      };

      const app = initializeApp(firebaseConfig);
      getAnalytics(app);

      const savedTokens = JSON.parse(localStorage.getItem("tokens"));
      const savedShape = JSON.parse(localStorage.getItem("shape"));
      if (savedTokens) setTokens(savedTokens);
      if (savedShape) setShape(savedShape);
    } catch {
      // Handle any initialisation errors silently
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tokens", JSON.stringify(tokens));
    localStorage.setItem("shape", JSON.stringify(shape));
  }, [tokens, shape]);

  // Utility Functions
  const updateTokenProperty = (token, key, value) => {
    setTokens((prevTokens) =>
      prevTokens.map((t) => (t === token ? { ...t, [key]: value } : t))
    );
  };

  const updateAllTokensProperty = (key, value) => {
    setTokens((prevTokens) => prevTokens.map((t) => ({ ...t, [key]: value })));
  };

  // Handlers
  const handleAddToken = (tokenUrl) => {
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
  };

  const removeToken = (token) => {
    setTokens((prevTokens) => prevTokens.filter((t) => t !== token));
  };

  const downloadToken = async (token) => {
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
  };

  return (
    <div>
      <AddToken handleAddToken={handleAddToken} />
      <Shape shape={shape} tokens={tokens} onUpdateShape={setShape} />
      <Table
        shape={shape}
        tokens={tokens}
        onRemoveToken={removeToken}
        onRemoveAllTokens={() => setTokens([])}
        onUpdateAllPawnsVisibility={(value) =>
          updateAllTokensProperty("showPawn", value)
        }
        onUpdateAllTokensVisibility={(value) =>
          updateAllTokensProperty("showToken", value)
        }
        onUpdateAllTokenTentsVisibility={(value) =>
          updateAllTokensProperty("showTent", value)
        }
        onUpdateAllTokensCountVisibility={(value) =>
          updateAllTokensProperty("count", value)
        }
        onUpdateTokenSize={(token, size) =>
          updateTokenProperty(token, "size", size)
        }
        onUpdateTokenQuantity={(token, quantity) =>
          updateTokenProperty(token, "quantity", quantity)
        }
        onUpdateTokenName={(token, name) =>
          updateTokenProperty(token, "name", name)
        }
        onUpdateTokenCountStart={(token, startFrom) =>
          updateTokenProperty(token, "startFrom", startFrom)
        }
        onUpdateTokenCount={(token, value) =>
          updateTokenProperty(token, "count", value)
        }
        onUpdateTokenTentVisibility={(token, value) =>
          updateTokenProperty(token, "showTent", value)
        }
        onUpdateTokenVisibility={(token, value) =>
          updateTokenProperty(token, "showToken", value)
        }
        onUpdatePawnVisibility={(token, value) =>
          updateTokenProperty(token, "showPawn", value)
        }
        onDownloadToken={downloadToken}
      />
      <Tokens shape={shape} tokens={tokens} />
    </div>
  );
};

export default App;
