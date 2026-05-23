import React, { useState, useEffect } from "react";

const DropboxChooser = ({
  appKey,
  success,
  cancel,
  linkType = "direct",
  multiselect = false,
  extensions = [".png", ".jpg", ".jpeg"],
  disabled = false,
  children,
}) => {
  const [isReady, setIsReady] = useState(typeof window !== "undefined" && !!window.Dropbox);

  useEffect(() => {
    if (isReady) return;

    // Check if script is already present in DOM
    let script = document.getElementById("dropboxjs");
    if (!script) {
      script = document.createElement("script");
      script.type = "text/javascript";
      script.id = "dropboxjs";
      script.src = "https://www.dropbox.com/static/api/2/dropins.js";
      script.setAttribute("data-app-key", appKey);
      document.body.appendChild(script);
    }

    const handleLoad = () => {
      setIsReady(true);
    };

    script.addEventListener("load", handleLoad);

    return () => {
      if (script) {
        script.removeEventListener("load", handleLoad);
      }
    };
  }, [appKey, isReady]);

  const handleChoose = (e) => {
    e.preventDefault();
    if (!isReady || disabled || !window.Dropbox) {
      console.warn("Dropbox script is not ready yet.");
      return;
    }

    window.Dropbox.choose({
      success,
      cancel,
      linkType,
      multiselect,
      extensions,
    });
  };

  return (
    <div 
      onClick={handleChoose} 
      style={{ cursor: isReady && !disabled ? "pointer" : "not-allowed" }}
    >
      {children}
    </div>
  );
};

export default DropboxChooser;
