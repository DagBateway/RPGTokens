import React from "react";
import { ShapeEnum } from "../constants/Enums";
import { useTranslation } from "../hooks/useTranslation";

const Shape = ({ tokens, shape, onUpdateShape }) => {
  const { t } = useTranslation();
  if (tokens.length === 0) return null;

  const shapes = [
    { type: ShapeEnum.SQUARE, icon: "fa-square" },
    { type: ShapeEnum.ROUND, icon: "fa-circle" },
  ];

  return (
    <div id="shape-selector" className="show">
      <span>{t("shapeSelectorLabel")}&nbsp;&nbsp;</span>
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
  );
};

export { Shape };
