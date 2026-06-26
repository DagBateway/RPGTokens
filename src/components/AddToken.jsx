import React, { useState } from "react";
import DropboxChooser from "./DropboxChooser";
import { useTranslation } from "../hooks/useTranslation";
import { resizeAndCompressImage } from "./Utils";

const AddToken = ({ handleAddToken }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(undefined);
  const [isDragging, setIsDragging] = useState(false);

  const validateProcess = async (url) => {
    try {
      await isValidImg(url);
      const validationError = handleAddToken(url);
      setError(validationError);
    } catch {
      setError("errorValidUrl");
    }
  };

  const isValidImg = (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(true);
      image.onerror = () => reject(false);
      image.src = url;
    });
  };

  const handleFiles = (files) => {
    files.forEach((file) =>
      validateProcess(file.link.replace("dl=0", "raw=1"))
    );
  };

  const handleLocalFiles = async (files) => {
    setError(undefined);
    for (const file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        setError("errorInvalidFormat");
        continue;
      }
      try {
        const compressedBase64 = await resizeAndCompressImage(file);
        const validationError = handleAddToken(compressedBase64);
        if (validationError) {
          setError(validationError);
        }
      } catch (err) {
        console.error("Compression error:", err);
        setError("errorValidUrl");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleLocalFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const handleAddTokenSubmit = (e) => {
    e.preventDefault();
    const tokenUrl = e.target.elements.tokenUrl.value.trim();
    validateProcess(tokenUrl);
    e.target.reset();
  };

  return (
    <div id="links-instructions" style={{ margin: "20px 0" }}>
      <div className="row">
        <div className="col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
          <div 
            id="add-link-container"
            className={isDragging ? "dragging" : ""}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="creator-station-badge">
              <i className="fas fa-dice-d20"></i> {t("creatorStationBadge")}
            </div>
            
            <div className="row align-items-center">
              {/* Left Column: Instructions */}
              <div className="col-md-6 text-left instructions-pane">
                <p>
                  <strong>{t("creatorInstructionsTitle")}</strong>
                </p>
                <ol>
                  <li>{t("creatorStep1")}</li>
                  <li>{t("creatorStep2")}</li>
                  <li>{t("creatorStep3")}</li>
                  <li>{t("creatorStep4")}</li>
                </ol>
                <p className="instructions-footer">
                  <strong>{t("creatorInstructionsFooter")}</strong>
                </p>
              </div>

              {/* Right Column: Interaction Form */}
              <div className="col-md-6 interaction-pane">
                <p className="prompt-text">
                  {t("insertLinkPrompt")}
                </p>
                <form
                  autoComplete="off"
                  id="tokens-form"
                  onSubmit={handleAddTokenSubmit}
                >
                  <input
                    placeholder={t("pastePlaceholder")}
                    className="url-input"
                    type="text"
                    name="tokenUrl"
                    aria-label={t("pastePlaceholder")}
                  />
                  <button className="btn btn-primary btn-lg">{t("addTokenBtn")}</button>
                </form>
                {error && <p className="error">{t(error)}</p>}
                
                <div className="or-divider">
                  <span>{t("orDivider")}</span>
                </div>

                <DropboxChooser
                  appKey="ki5u4q9h7qgzlkr"
                  success={handleFiles}
                  multiselect={true}
                  extensions={[".jpg", ".jpeg", ".png"]}
                >
                  <div className="dropbox-button">
                    {t("uploadDropboxBtn")}&nbsp;
                    <i className="fab fa-dropbox"></i>
                  </div>
                </DropboxChooser>

                <div style={{ marginTop: "12px", width: "100%", display: "flex", justifyContent: "center" }}>
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg"
                    style={{ display: "none" }}
                    id="local-file-input"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleLocalFiles(Array.from(e.target.files));
                      }
                      e.target.value = ""; // Reset input so same file can be selected again
                    }}
                  />
                  <label htmlFor="local-file-input" className="upload-button">
                    {t("uploadLocalBtn")}&nbsp;
                    <i className="fas fa-upload"></i>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AddToken };


