import React, { useEffect } from "react";
import { AddToken } from "./components/AddToken";
import { Table } from "./components/Table";
import { Shape } from "./components/Shape";
import { Tokens } from "./components/Tokens";
import { useTokens } from "./hooks/useTokens";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const App = () => {
  const {
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
  } = useTokens();

  // Firebase Initialisation
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
    } catch (error) {
      console.warn("Firebase initialization failed silently:", error);
    }
  }, []);

  return (
    <div>
      <AddToken handleAddToken={handleAddToken} />
      <Shape
        shape={shape}
        tokens={tokens}
        onUpdateShape={setShape}
        transparentDownload={transparentDownload}
        onUpdateTransparentDownload={setTransparentDownload}
      />
      <Table
        shape={shape}
        tokens={tokens}
        onRemoveToken={removeToken}
        onRemoveAllTokens={removeAllTokens}
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
