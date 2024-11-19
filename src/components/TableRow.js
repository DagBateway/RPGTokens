import React from "react";
import { ShapeEnum, SizeEnum } from "../constants/Enums";
import { uuidByString } from "./Utils";

const ToggleButtonGroup = ({ label, icon, value, onUpdate }) => (
  <td>
    <label className="mobile">{label}:</label>
    <div className="btn-group btn-group-toggle" data-toggle="buttons">
      <label className={`btn btn-primary ${!value && "active"}`}>
        <input onClick={() => onUpdate(false)} type="checkbox" />
        <i className={`fas ${icon}`}></i>
      </label>
      <label className={`btn btn-success ${value && "active"}`}>
        <input onClick={() => onUpdate(true)} type="checkbox" />
        <i className={`fas ${icon}`}></i>
      </label>
    </div>
  </td>
);

const TableRow = ({
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
        <label className="mobile">Name:</label>
        <input
          className="form-control"
          type="text"
          defaultValue={name}
          onChange={(event) => onUpdateTokenName(token, event.target.value)}
        />
      </td>
      <td>
        <label className="mobile">Size:</label>
        <select
          className="form-control"
          value={SizeEnum.properties[size].value}
          onChange={(event) => onUpdateTokenSize(token, event.target.value)}
        >
          {Object.keys(SizeEnum.properties).map((key) => (
            <option key={key} value={key}>
              {SizeEnum.properties[key].label}
            </option>
          ))}
        </select>
      </td>
      <td>
        <label className="mobile">Quantity:</label>
        <input
          className="form-control"
          type="number"
          defaultValue={quantity}
          onChange={(event) => onUpdateTokenQuantity(token, event.target.value)}
          min="1"
          max="99"
        />
      </td>
      <td>
        <label className="mobile">Count Start:</label>
        <input
          className="form-control"
          type="number"
          defaultValue={startFrom || 1}
          disabled={!count}
          onChange={(event) =>
            onUpdateTokenCountStart(token, event.target.value)
          }
          min="1"
        />
      </td>
      <ToggleButtonGroup
        label="Count"
        icon="fa-list-ol"
        value={count}
        onUpdate={(value) => onUpdateTokenCount(token, value)}
      />
      <ToggleButtonGroup
        label="Monster Tents"
        icon="fa-map"
        value={showTent}
        onUpdate={(value) => onUpdateTokenTentVisibility(token, value)}
      />
      <ToggleButtonGroup
        label="Token"
        icon="fa-user-circle"
        value={showToken}
        onUpdate={(value) => onUpdateTokenVisibility(token, value)}
      />
      <ToggleButtonGroup
        label="Paper Pawn"
        icon="fa-chess-pawn"
        value={showPawn}
        onUpdate={(value) => onUpdatePawnVisibility(token, value)}
      />
      <td className="delete">
        <label className="mobile">Delete:</label>
        <button
          type="button"
          className="btn btn-warning"
          onClick={() => {
            if (window.confirm(`Are you sure you wish to remove ${name}?`)) {
              onRemoveToken(token);
            }
          }}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  );
};

export { TableRow };
