import React from "react";
import { ShapeEnum } from "../constants/Enums";

const Shape = ({
  tokens,
  shape,
  onUpdateShape,
  transparentDownload,
  onUpdateTransparentDownload,
}) => {
  if (tokens.length === 0) return null;

  const shapes = [
    { type: ShapeEnum.SQUARE, icon: "fa-square" },
    { type: ShapeEnum.ROUND, icon: "fa-circle" },
  ];

  return (
    <div id="shape-selector" className="show">
      <div className="shape-selector-group">
        <span>Select a shape for the tokens:&nbsp;&nbsp;</span>
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
          {shapes.map(({ type, icon }) => (
            <label
              key={type}
              className={`btn btn-primary ${shape === type ? "active" : ""}`}
            >
              <input
                type="radio"
                name="shape"
                onClick={() => onUpdateShape(type)}
                aria-label={`Select ${type} shape`}
              />
              <i className={`far ${icon}`} />
            </label>
          ))}
        </div>
      </div>

      <div className="transparent-toggle-group">
        <span>Transparent PNG Downloads:&nbsp;&nbsp;</span>
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
          <label className={`btn btn-primary ${!transparentDownload ? "active" : ""}`}>
            <input onClick={() => onUpdateTransparentDownload(false)} type="checkbox" />
            <i className="fas fa-ban"></i> Off
          </label>
          <label className={`btn btn-success ${transparentDownload ? "active" : ""}`}>
            <input onClick={() => onUpdateTransparentDownload(true)} type="checkbox" />
            <i className="fas fa-ghost"></i> On
          </label>
        </div>
      </div>
    </div>
  );
};

export { Shape };
