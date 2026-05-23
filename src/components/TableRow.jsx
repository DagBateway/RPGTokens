import React, { memo } from "react";
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
    <tr>
      <td className={`token-image ${showToken ? "" : "greyscale"}`}>
        <div
          id={uuidByString(url)}
          className={`token medium ${ShapeEnum.properties[shape].name}`}
        >
          <img alt={name} src={url} />
          {count && <div className="number">#</div>}
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
  );
});

export { TableRow };
