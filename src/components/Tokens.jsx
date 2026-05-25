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
  const { t } = useTranslation();

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
    const isGargantuan = Number(token.size) === SizeEnum.GARGANTUAN;

    if (isGargantuan) {
      return Array.from({ length: end - start }, (_, i) => [
        // Part 1: Left column (the back template)
        <div
          className="mini-container gargantuan part1"
          key={`${token.id || token.url}-${i}-part1`}
        >
          <div className="back">
            <div className="base">
              <img alt={token.name} src={getCorsProxiedUrl(token.url)} className="creature" />
            </div>
            <div className="mini-wrapper">
              {token.count && <div className="number">{start + i}</div>}
              <div className="mini">
                <img alt={token.name} src={getCorsProxiedUrl(token.url)} className="creature" />
              </div>
            </div>
          </div>
        </div>,
        // Part 2: Right column (the front template)
        <div
          className="mini-container gargantuan part2"
          key={`${token.id || token.url}-${i}-part2`}
        >
          <div className="front">
            <div className="mini-wrapper">
              {token.count && <div className="number">{start + i}</div>}
              <div className="mini">
                <img alt={token.name} src={getCorsProxiedUrl(token.url)} className="creature" />
              </div>
            </div>
            <div className="base">
              <img alt={token.name} src={getCorsProxiedUrl(token.url)} className="creature" />
            </div>
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
            {<p>{token.name}</p>}
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
        <div className="print-legend">
          <div className="legend-title">{t("legendTitle")}</div>
          <div className="legend-item">
            <span className="line dashed-line"></span>
            <span className="label">{t("legendFold")}</span>
          </div>
          <div className="legend-item">
            <span className="line solid-line"></span>
            <span className="label">{t("legendCut")}</span>
          </div>
        </div>
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
