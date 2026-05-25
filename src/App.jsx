import React, { useState, useEffect } from "react";
import { AddToken } from "./components/AddToken";
import { Table } from "./components/Table";
import { Tokens } from "./components/Tokens";
import { useTokens } from "./hooks/useTokens";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useTranslation } from "./hooks/useTranslation";
import { TRANSLATIONS } from "./constants/Translations";
import FeedbackWidget from "./components/FeedbackWidget";

const App = () => {
  const { t, language, setLanguage } = useTranslation();

  const {
    tokens,
    shape,
    setShape,
    handleAddToken,
    removeToken,
    removeAllTokens,
    updateTokenProperty,
    updateAllTokensProperty,
    downloadToken,
  } = useTokens();

  // Theme State & Sync
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      return saved ? saved : "dark";
    } catch {
      return "dark";
    }
  });

  const [changelogOpen, setChangelogOpen] = useState(false);


  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
      if (theme === "light") {
        document.body.classList.add("light-mode");
        document.documentElement.classList.add("light-mode");
      } else {
        document.body.classList.remove("light-mode");
        document.documentElement.classList.remove("light-mode");
      }
    } catch (error) {
      console.warn("Theme saving failed:", error);
    }
  }, [theme]);

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

  // Measure and update the header height dynamically for pixel-perfect sticky table headers
  useEffect(() => {
    const header = document.querySelector(".header");
    if (!header) return;

    const updateHeaderHeight = () => {
      const rect = header.getBoundingClientRect();
      document.documentElement.style.setProperty("--header-height", `${rect.height}px`);
    };

    updateHeaderHeight();

    // Use ResizeObserver for responsive dynamic adjustments
    let observer;
    if (window.ResizeObserver) {
      observer = new ResizeObserver(updateHeaderHeight);
      observer.observe(header);
    }

    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <h1>{t("headerTitle")}</h1>
          <div className="header-actions" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              id="language-toggle"
              aria-label="Toggle language"
              onClick={() => setLanguage(language === "en" ? "it" : "en")}
            >
              <i className="fas fa-globe"></i>
              <span> {language === "en" ? "ITALIANO" : "ENGLISH"}</span>
            </button>
            <button
              id="theme-toggle"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "light" ? (
                <>
                  <i className="fas fa-dungeon"></i>
                  <span> {t("themeGothicDark")}</span>
                </>
              ) : (
                <>
                  <i className="fas fa-scroll"></i>
                  <span> {t("themeParchment")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main role="main" className="container">
        {/* Immersive Gothic Intro Section */}
        <section className="intro-section">
          <p className="lead-text">
            <strong>{t("headerTitle")}</strong> {t("introLead")}
          </p>
          <p className="sub-text">
            {t("introSub")}
          </p>
        </section>

        {/* Visual 3-Pillar Step-by-Step Instructions */}
        <section className="how-to-use-section">
          <h2>{t("stepTitle")}</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="instruction-card">
                <div className="card-icon"><i className="fas fa-link"></i></div>
                <h3>{t("step1Title")}</h3>
                <p>{t("step1Desc")}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="instruction-card">
                <div className="card-icon"><i className="fas fa-sliders-h"></i></div>
                <h3>{t("step2Title")}</h3>
                <p>{t("step2Desc")}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="instruction-card">
                <div className="card-icon"><i className="fas fa-print"></i></div>
                <h3>{t("step3Title")}</h3>
                <p>{t("step3Desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Support Crafting Tips */}
        <section className="crafting-tips-section">
          <h2>{t("craftTitle")}</h2>
          <p>{t("craftDesc")}</p>
        </section>

        {/* Crafting Links Row with dynamic columns based on language */}
        <div className="row crafting-links-row" style={{ marginBottom: "30px" }}>
          {language === "it" ? (
            <div className="col-md-6 mx-auto">
              <div className="main-links">
                <p>{t("amazonIt")}</p>
                <ul>
                  <li><a target="_blank" rel="noopener noreferrer" href="https://www.amazon.it/dp/B07T8JDR3G">{t("craftFeltPads")}</a></li>
                  <li><a target="_blank" rel="noopener noreferrer" href="https://www.amazon.it/Trasparenti-Adesivi-Epossidica-Autoadesivi-Gioielli/dp/B07RR99H52/">{t("craftDomes")}</a></li>
                  <li><a target="_blank" rel="noopener noreferrer" href="https://www.amazon.it/Artibetter-Dischi-quadrati-decorazioni-rustiche/dp/B0874QX5SR/">{t("craftWoodenSquares")}</a></li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div className="col-md-6">
                <div className="main-links">
                  <p>{t("amazonUs")}</p>
                  <ul>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://www.amazon.com/Furniture-Quantity-Adhesive-Protector-Hardwood/dp/B0856S85ZR">{t("craftFeltPads")}</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://www.amazon.com/MEYA-Adhesive-Stickers-Pendants-Scrapbooking/dp/B076B75HB6">{t("craftDomes")}</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://www.amazon.com/Foraineam-Unfinished-Cutouts-Natural-Decoration/dp/B08BL5JNTT">{t("craftWoodenDiscs")}</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="main-links">
                  <p>{t("amazonAus")}</p>
                  <ul>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://amzn.to/3YYNYdG">{t("craftFeltPads")}</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://amzn.to/4ft94rI">{t("craftDomes")}</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://amzn.to/3YNSJXy">{t("craftPlasticDiscs")}</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://amzn.to/3Ogn4ZP">{t("craftWoodenDiscs")}</a></li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Creator Station Component */}
        <AddToken handleAddToken={handleAddToken} />

        {/* Interactive Creature Database Grid */}
        <Table
          shape={shape}
          tokens={tokens}
          onRemoveToken={removeToken}
          onRemoveAllTokens={removeAllTokens}
          onUpdateTokenProperty={updateTokenProperty}
          onUpdateAllMinisVisibility={(value) =>
            updateAllTokensProperty("showMini", value)
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
          onUpdateMiniVisibility={(token, value) =>
            updateTokenProperty(token, "showMini", value)
          }
          onDownloadToken={downloadToken}
        />

        {/* Printable Canvas */}
        <Tokens shape={shape} tokens={tokens} />

        {/* Localized Gothic Feedback Widget */}
        <FeedbackWidget />

        {/* Support Section */}
        <div id="donate">
          <div className="row" id="dmsguild-support">
            <div className="col-md-12">
              <div className="instructions">
                <p><strong>{t("supportTitle")}</strong></p>
                <p>{t("supportBody")}</p>
                <p>
                  <a target="_blank" rel="noopener noreferrer" href="https://www.dmsguild.com/en/browse?authorName=%22Alberto%20Camillo%22">
                    <i className="fas fa-dice-d20"></i> {t("supportBtn")}
                  </a>
                </p>
                <p>{t("supportFooter")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Changelog Collapsible */}
        <div className="changelog-section">
          <button
            id="changelog-toggle"
            className="changelog-toggle"
            onClick={() => setChangelogOpen(o => !o)}
            aria-expanded={changelogOpen}
          >
            <i className={`fas fa-chevron-${changelogOpen ? "up" : "down"}`}></i>
            <span> Changelog</span>
          </button>
          <div className={`changelog-content${changelogOpen ? " changelog-content--open" : ""}`}>
            <div className="changelog-inner">
              {(TRANSLATIONS[language]?.changelog || TRANSLATIONS.en.changelog).map((entry, index) => (
                <div className="changelog-entry" key={index}>
                  <span className="changelog-date">{entry.date}</span>
                  <p dangerouslySetInnerHTML={{ __html: entry.desc }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <span className="text-muted">{t("footerCopyright")}</span>
        </div>
      </footer>

      {/* Sticky Action Bar — only shown when there are tokens */}
      {tokens.length > 0 && (
        <div id="sticky-action-bar">
          <div id="sticky-action-bar-inner">
            <div id="sticky-shape-selector">
              <span className="sticky-label">
                <i className="fas fa-shapes"></i>&nbsp;&nbsp;{t("shapeSelectorLabel")}
              </span>
              <div className="btn-group btn-group-toggle" data-toggle="buttons">
                {[
                  { type: 0, icon: "fa-square", label: "Square" },
                  { type: 1, icon: "fa-circle", label: "Round" },
                ].map(({ type, icon, label }) => (
                  <label
                    key={type}
                    className={`btn btn-primary ${shape === type ? "active" : ""}`}
                    aria-label={`Select ${label} shape`}
                  >
                    <input type="radio" name="sticky-shape" onClick={() => setShape(type)} />
                    <i className={`far ${icon}`} />
                  </label>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              id="print-all"
              onClick={() => window.print()}
            >
              <i className="fas fa-print"></i>&nbsp;{t("btnPrint")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;

