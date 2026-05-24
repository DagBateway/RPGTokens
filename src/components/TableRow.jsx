import React, { useState, useRef, useEffect, memo } from "react";
import { ShapeEnum, SizeEnum } from "../constants/Enums";
import { uuidByString } from "./Utils";
import { useTranslation } from "../hooks/useTranslation";

const ToggleButtonGroup = ({ label, icon, value, onUpdate }) => (
  <td>
    <label className="mobile">{label}:</label>
    <div className="btn-group btn-group-toggle" data-toggle="buttons">
      <label className={`btn btn-primary ${!value && "active"}`}>
        <input onClick={() => onUpdate(false)} type="checkbox" aria-label={`Disable ${label}`} />
        <i className="fas fa-ban"></i>
      </label>
      <label className={`btn btn-success ${value && "active"}`}>
        <input onClick={() => onUpdate(true)} type="checkbox" aria-label={`Enable ${label}`} />
        <i className={`fas ${icon}`}></i>
      </label>
    </div>
  </td>
);

const TableRow = memo(({
  token,
  shape,
  onUpdateTokenName,
  onUpdateTokenSize,
  onUpdateTokenQuantity,
  onUpdateTokenCount,
  onUpdateTokenTentVisibility,
  onUpdateTokenVisibility,
  onUpdatePawnVisibility,
  onUpdateTokenCountStart,
  onRemoveToken,
  onDownloadToken,
  onUpdateTokenProperty,
}) => {
  const { t } = useTranslation();
  
  const {
    id,
    name,
    url,
    size,
    quantity,
    startFrom,
    count,
    showTent,
    showToken,
    showPawn,
  } = token;

  const [showAdjust, setShowAdjust] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    await onDownloadToken(token);
    setIsDownloading(false);
  };
  const [dragStart, setDragStart] = useState(null);
  const [offsetStart, setOffsetStart] = useState({ x: 0, y: 0 });
  const tokenRef = useRef(null);
  
  // Keep refs so window listeners always see the latest values without stale closures
  const dragStartRef = useRef(null);
  const offsetStartRef = useRef({ x: 0, y: 0 });
  const tokenValRef = useRef(token);

  useEffect(() => {
    tokenValRef.current = token;
  }, [token]);

  useEffect(() => {
    const el = tokenRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomStep = 5;
      const currentZoom = token.zoom ?? 100;
      const newZoom = e.deltaY < 0
        ? Math.min(300, currentZoom + zoomStep)
        : Math.max(50, currentZoom - zoomStep);
      onUpdateTokenProperty(token, "zoom", newZoom);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [token, onUpdateTokenProperty]);

  // Attach global mouse listeners while dragging so the drag continues outside the token element
  useEffect(() => {
    if (!dragStart) return;

    const handleWindowMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const ds = dragStartRef.current;
      const os = offsetStartRef.current;
      if (!ds) return;

      const dx = clientX - ds.x;
      const dy = clientY - ds.y;

      const currentToken = tokenValRef.current;
      const tokenElement = document.getElementById(uuidByString(currentToken.url));
      const rect = tokenElement ? tokenElement.getBoundingClientRect() : { width: 96, height: 96 };
      const scaleFactor = (currentToken.zoom ?? 100) / 100;

      const pctX = (dx / rect.width) * 100 / scaleFactor;
      const pctY = (dy / rect.height) * 100 / scaleFactor;

      const newOffsetX = Math.max(-100, Math.min(100, Math.round(os.x + pctX)));
      const newOffsetY = Math.max(-100, Math.min(100, Math.round(os.y + pctY)));

      onUpdateTokenProperty(currentToken, { offsetX: newOffsetX, offsetY: newOffsetY });
    };

    const handleWindowUp = () => setDragStart(null);

    window.addEventListener("mousemove", handleWindowMove);
    window.addEventListener("mouseup", handleWindowUp);
    window.addEventListener("touchmove", handleWindowMove);
    window.addEventListener("touchend", handleWindowUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMove);
      window.removeEventListener("mouseup", handleWindowUp);
      window.removeEventListener("touchmove", handleWindowMove);
      window.removeEventListener("touchend", handleWindowUp);
    };
  }, [dragStart, onUpdateTokenProperty]);

  const handleDragStart = (e) => {
    if (e.button && e.button !== 0) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const start = { x: clientX, y: clientY };
    const os = { x: token.offsetX ?? 0, y: token.offsetY ?? 0 };
    dragStartRef.current = start;
    offsetStartRef.current = os;
    setDragStart(start);
    setOffsetStart(os);
    if (e.cancelable) e.preventDefault();
  };

  const handleDragEnd = () => setDragStart(null);

  const getLocalizedSizeLabel = (value) => {
    switch (value.name) {
      case "tiny": return `${t("sizeTiny")} (0.75x0.75 in)`;
      case "small": return `${t("sizeSmall")} (1x1 in)`;
      case "medium": return `${t("sizeMedium")} (1x1 in)`;
      case "large1": return `${t("sizeLarge")} (1.5x1.5 in)`;
      case "large2": return `${t("sizeLarge")} (2x2 in)`;
      case "huge": return `${t("sizeHuge")} (3x3 in)`;
      case "gargantuan": return `${t("sizeGargantuan")} (4x4 in)`;
      default: return value.label || value.name;
    }
  };

  return (
    <>
      <tr>
        <td 
          className={`token-image ${showToken ? "" : "greyscale"}`}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
        >
          <div
            id={uuidByString(url)}
            ref={tokenRef}
            className={`token medium ${ShapeEnum.properties[shape].name}`}
            style={{ 
              position: "relative", 
              overflow: "hidden",
              cursor: dragStart ? "grabbing" : "grab",
              touchAction: "none"
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <img 
              alt={name} 
              src={url} 
              style={{
                transform: `translate(${token.offsetX ?? 0}%, ${token.offsetY ?? 0}%) scale(${(token.zoom ?? 100) / 100})`,
                transformOrigin: "center center",
                pointerEvents: "none"
              }}
            />
            {count && <div className="number" style={{ pointerEvents: "none" }}>#</div>}
          </div>
          <div style={{ marginTop: "6px" }}>
            <button
              type="button"
              className={`btn btn-xs ${showAdjust ? "btn-primary" : "btn-warning"}`}
              style={{ fontSize: "10px", padding: "3px 8px", minWidth: "75px" }}
              onClick={() => setShowAdjust(!showAdjust)}
            >
              <i className={`fas ${showAdjust ? "fa-check" : "fa-sliders-h"}`}></i>
              {showAdjust ? ` ${t("btnDone")}` : ` ${t("btnAdjust")}`}
            </button>
          </div>
        </td>
        <td className="token-name">
          <label className="mobile">{t("thName")}:</label>
          <input
            className="form-control"
            type="text"
            defaultValue={name}
            aria-label={t("thName")}
            onChange={(event) => onUpdateTokenName(token, event.target.value)}
          />
        </td>
        <td>
          <label className="mobile">{t("thSize")}:</label>
          <select
            className="form-control"
            value={token.size}
            aria-label={t("thSize")}
            onChange={(event) => onUpdateTokenSize(token, event.target.value)}
          >
            {Object.entries(SizeEnum.properties).map(([key, value]) => (
              <option key={key} value={value.value}>
                {getLocalizedSizeLabel(value)}
              </option>
            ))}
          </select>
        </td>
        <td>
          <label className="mobile">{t("thQuantity")}:</label>
          <input
            className="form-control"
            type="number"
            defaultValue={quantity}
            aria-label={t("thQuantity")}
            onChange={(event) => onUpdateTokenQuantity(token, event.target.value)}
            min="1"
            max="99"
          />
        </td>
        <td>
          <label className="mobile">{t("thCountStart")}:</label>
          <input
            className="form-control"
            type="number"
            defaultValue={startFrom || 1}
            disabled={!count}
            aria-label={t("thCountStart")}
            onChange={(event) =>
              onUpdateTokenCountStart(token, event.target.value)
            }
            min="1"
          />
        </td>
        <ToggleButtonGroup
          label={t("thCount")}
          icon="fa-list-ol"
          value={count}
          onUpdate={(value) => onUpdateTokenCount(token, value)}
        />
        <ToggleButtonGroup
          label={t("thMonsterTent")}
          icon="fa-map"
          value={showTent}
          onUpdate={(value) => onUpdateTokenTentVisibility(token, value)}
        />
        <ToggleButtonGroup
          label={t("thToken")}
          icon="fa-user-circle"
          value={showToken}
          onUpdate={(value) => onUpdateTokenVisibility(token, value)}
        />
        <ToggleButtonGroup
          label={t("thPaperPawn")}
          icon="fa-chess-pawn"
          value={showPawn}
          onUpdate={(value) => onUpdatePawnVisibility(token, value)}
        />
        <td className="download">
          <label className="mobile">{t("thDownload")}:</label>
          <button
            type="button"
            className="btn btn-primary"
            aria-label={t("thDownload")}
            disabled={isDownloading}
            onClick={handleDownload}
          >
            {isDownloading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-download"></i>
            )}
          </button>
        </td>
        <td className="delete">
          <label className="mobile">{t("thDelete")}:</label>
          <button
            type="button"
            className="btn btn-warning"
            aria-label={t("thDelete")}
            onClick={() => {
              if (window.confirm(t("confirmDeleteToken", { name }))) {
                onRemoveToken(token);
              }
            }}
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
      {showAdjust && (
        <tr className="adjustments-row" style={{ background: "rgba(12, 17, 20, 0.45)" }}>
          <td colSpan="11" style={{ borderTop: "none", padding: "16px 24px" }}>
            <div className="adjustments-container" style={{ display: "flex", gap: "24px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ width: "100%", marginBottom: "12px", borderBottom: "1px solid rgba(207, 160, 53, 0.15)", paddingBottom: "10px" }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#8e9e95", fontStyle: "italic" }}>
                  <i className="fas fa-info-circle" style={{ color: "#cfa035", marginRight: "6px" }}></i>
                  {t("labelAdjustTip")}
                </p>
              </div>
              <div style={{ display: "flex", gap: "24px", flex: "1", minWidth: "300px", flexWrap: "wrap" }}>
                {/* Zoom Slider */}
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ fontSize: "12px", color: "#cfa035", marginBottom: "6px", display: "block", fontFamily: "'Cinzel', serif", letterSpacing: "0.5px" }}>
                    {t("labelZoom")}: <strong style={{ color: "#ffffff" }}>{token.zoom ?? 100}%</strong>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={token.zoom ?? 100}
                    onChange={(e) => onUpdateTokenProperty(token, "zoom", parseInt(e.target.value))}
                    style={{ width: "100%", cursor: "pointer", accentColor: "#cfa035" }}
                  />
                </div>
                {/* Horizontal Position Slider */}
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ fontSize: "12px", color: "#cfa035", marginBottom: "6px", display: "block", fontFamily: "'Cinzel', serif", letterSpacing: "0.5px" }}>
                    {t("labelOffsetX")}: <strong style={{ color: "#ffffff" }}>{token.offsetX ?? 0}%</strong>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={token.offsetX ?? 0}
                    onChange={(e) => onUpdateTokenProperty(token, "offsetX", parseInt(e.target.value))}
                    style={{ width: "100%", cursor: "pointer", accentColor: "#cfa035" }}
                  />
                </div>
                {/* Vertical Position Slider */}
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ fontSize: "12px", color: "#cfa035", marginBottom: "6px", display: "block", fontFamily: "'Cinzel', serif", letterSpacing: "0.5px" }}>
                    {t("labelOffsetY")}: <strong style={{ color: "#ffffff" }}>{token.offsetY ?? 0}%</strong>
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={token.offsetY ?? 0}
                    onChange={(e) => onUpdateTokenProperty(token, "offsetY", parseInt(e.target.value))}
                    style={{ width: "100%", cursor: "pointer", accentColor: "#cfa035" }}
                  />
                </div>
              </div>
              <div style={{ flexShrink: 0, display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className="btn btn-warning btn-sm"
                  style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.5px", padding: "6px 16px" }}
                  onClick={() => {
                    onUpdateTokenProperty(token, { zoom: 100, offsetX: 0, offsetY: 0 });
                  }}
                >
                  <i className="fas fa-undo"></i> {t("labelReset")}
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
});

export { TableRow };
