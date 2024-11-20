import React, { useState, useEffect } from "react";
import {
  DropboxLoadingStatusEnum,
  SizeEnum,
  ShapeEnum,
} from "../constants/Enums";

const Tokens = ({ tokens, shape }) => {
  const [status, setStatus] = useState(DropboxLoadingStatusEnum.LOADING);

  useEffect(() => {
    // Simulate loading completion
    setStatus(DropboxLoadingStatusEnum.LOADED);
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
        className={`token ${SizeEnum.properties[token.size].name} ${
          ShapeEnum.properties[shape].name
        }`}
      >
        <img alt={token.name} src={token.url} />
        {token.count && <div className="number">{start + i}</div>}
      </div>
    ));
  };

  const createTokensTents = (token) => (
    <div className="tent" key={token.id || token.url}>
      <div className="side back">
        <div className="name">
          <p>{token.name}</p>
        </div>
        <div className="notes">
          <p>Notes:</p>
        </div>
      </div>
      <div className="side front">
        <div className="name">
          <p>{token.name}</p>
        </div>
        <div className="image">
          <img alt={token.name} src={token.url} className="creature" />
        </div>
      </div>
    </div>
  );

  const createPawnsList = (token) => {
    const start = parseInt(token.startFrom, 10) || 1;
    const end = start + parseInt(token.quantity, 10) || 1;
    return Array.from({ length: end - start }, (_, i) => (
      <div
        className={`pawn-container ${SizeEnum.properties[token.size].name}`}
        key={`${token.id || token.url}-${i}`}
      >
        <div className="back">
          <div className="base"></div>
          <div className="pawn-wrapper">
            {token.count && <div className="number">{start + i}</div>}
            <div className="pawn">
              <img alt={token.name} src={token.url} className="creature" />
            </div>
          </div>
        </div>
        <div className="front">
          <div className="pawn-wrapper">
            {token.count && <div className="number">{start + i}</div>}
            <div className="pawn">
              <img alt={token.name} src={token.url} className="creature" />
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
        {renderTokens(tokens, shape, "showPawn", createPawnsList)}
      </div>
    </div>
  );
};

export { Tokens };
