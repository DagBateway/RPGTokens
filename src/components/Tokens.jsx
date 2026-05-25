import React, { useState, useEffect, memo } from "react";
import {
  DropboxLoadingStatusEnum,
  SizeEnum,
  ShapeEnum,
} from "../constants/Enums";
import { useTranslation } from "../hooks/useTranslation";
import { getCorsProxiedUrl } from "./Utils";

const Tokens = memo(({ tokens, shape }) => {
  const [status, setStatus] = useState(DropboxLoadingStatusEnum.LOADING);

  useEffect(() => {
    // Simulate loading completion
    setStatus(DropboxLoadingStatusEnum.COMPLETED);
  }, []);

  const renderTokens = (tokens, shape, showKey, renderFn) => {
    return tokens
      .filter((token) => token[showKey])
      .sort(
        (a, b) =>
          SizeEnum.properties[a.size].value - SizeEnum.properties[b.size].value
      )
      .flatMap((token) => renderFn(token));
  };

  const createTokensList = (token) => {
    const start = parseInt(token.startFrom, 10) || 1;
    const end = start + parseInt(token.quantity, 10) || 1;
    return Array.from({ length: end - start }, (_, i) => (
      <div
        key={`${token.id || token.url}-${i}`}
        className={`token ${SizeEnum.properties[token.size].name} ${ShapeEnum.properties[shape].name
          }`}
      >
        <img
          alt={token.name}
          src={getCorsProxiedUrl(token.url)}
          style={{
            transform: `translate(${token.offsetX ?? 0}%, ${token.offsetY ?? 0}%) scale(${(token.zoom ?? 100) / 100})`,
            transformOrigin: "center center"
          }}
        />
        {token.count && <div className="number">{start + i}</div>}
      </div>
    ));
  };

  const createTokensTents = (token) => {
    const { t } = useTranslation();
    return (
      <div className="tent" key={token.id || token.url}>
        <div className="side back">
          <div className="name">
            <p>{token.name}</p>
          </div>
          <div className="notes">
            <p>{t("tentNotes")}</p>
          </div>
        </div>
        <div className="side front">
          <div className="name">
            <p>{token.name}</p>
          </div>
          <div className="image">
            <img alt={token.name} src={getCorsProxiedUrl(token.url)} className="creature" />
          </div>
        </div>
      </div>
    );
  };

  const createMinisList = (token) => {
    const start = parseInt(token.startFrom, 10) || 1;
    const end = start + parseInt(token.quantity, 10) || 1;

    if (token.size === SizeEnum.GARGANTUAN) {
      // 3D Interlocking Gargantuan Mini: Render Part 1 and Part 2 per quantity
      return Array.from({ length: end - start }, (_, i) => [
        // Part 1: Slit cut from bottom
        <div
          className={`mini-container gargantuan part1`}
          key={`${token.id || token.url}-${i}-part1`}
        >
          <div className="gargantuan-title">Gargantuan 3D Mini - Part 1</div>
          <div className="interlocking-card">
            {/* Top Half (Flipped 180 degrees) */}
            <div className="half top">
              <img
                alt={token.name}
                src={getCorsProxiedUrl(token.url)}
                className="creature rotated"
              />
              <div className="label top-label">{token.name}</div>
            </div>
            {/* Bottom Half (Normal) */}
            <div className="half bottom">
              <img
                alt={token.name}
                src={getCorsProxiedUrl(token.url)}
                className="creature"
              />
              <div className="label bottom-label">{token.name}</div>
            </div>
            {/* Solid black slit guide starting from bottom to the center fold */}
            <div className="slit slit-bottom"></div>
          </div>
          <div className="gargantuan-instructions">
            1. Trim along dotted border | 2. Fold horizontal center | 3. Cut solid line from bottom
          </div>
        </div>,
        // Part 2: Slit cut from top
        <div
          className={`mini-container gargantuan part2`}
          key={`${token.id || token.url}-${i}-part2`}
        >
          <div className="gargantuan-title">Gargantuan 3D Mini - Part 2</div>
          <div className="interlocking-card">
            {/* Top Half (Flipped 180 degrees) */}
            <div className="half top">
              <img
                alt={token.name}
                src={getCorsProxiedUrl(token.url)}
                className="creature rotated"
              />
              <div className="label top-label">{token.name}</div>
            </div>
            {/* Bottom Half (Normal) */}
            <div className="half bottom">
              <img
                alt={token.name}
                src={getCorsProxiedUrl(token.url)}
                className="creature"
              />
              <div className="label bottom-label">{token.name}</div>
            </div>
            {/* Solid black slit guide starting from top to the center fold */}
            <div className="slit slit-top"></div>
          </div>
          <div className="gargantuan-instructions">
            1. Trim along dotted border | 2. Fold horizontal center | 3. Cut solid line from top
          </div>
        </div>
      ]).flat();
    }

    return Array.from({ length: end - start }, (_, i) => (
      <div
        className={`mini-container ${SizeEnum.properties[token.size].name}`}
        key={`${token.id || token.url}-${i}`}
      >
        <div className="back">
          <div className="base"></div>
          <div className="mini-wrapper">
            {token.count && <div className="number">{start + i}</div>}
            <div className="mini">
              <img alt={token.name} src={getCorsProxiedUrl(token.url)} className="creature" />
            </div>
          </div>
        </div>
        <div className="front">
          <div className="mini-wrapper">
            {token.count && <div className="number">{start + i}</div>}
            <div className="mini">
              <img alt={token.name} src={getCorsProxiedUrl(token.url)} className="creature" />
            </div>
          </div>
          <div className="base">
            <p>{token.name}</p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      {status === DropboxLoadingStatusEnum.LOADING && (
        <div className="loading">Loading…</div>
      )}
      <div className="printable" id="printed-tokens">
        {renderTokens(tokens, shape, "showToken", createTokensList)}
        {renderTokens(tokens, shape, "showTent", (token) => [
          createTokensTents(token),
        ])}
        {renderTokens(tokens, shape, "showMini", createMinisList)}
      </div>
    </div>
  );
});

export { Tokens };
