import React, { useState } from "react";
import DropboxChooser from "./DropboxChooser";
import { useTranslation } from "../hooks/useTranslation";

const AddToken = ({ handleAddToken }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(undefined);

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
          <div id="add-link-container">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AddToken };

