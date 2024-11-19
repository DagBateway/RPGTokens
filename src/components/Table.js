import React, { memo } from "react";
import { TableRow } from "./TableRow";

const Table = ({
  tokens,
  shape,
  onUpdateAllTokensCountVisibility,
  onUpdateAllTokenTentsVisibility,
  onUpdateAllTokensVisibility,
  onUpdateAllPawnsVisibility,
  onRemoveAllTokens,
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
}) => {
  const renderBulkSelection = () => (
    <tr id="bulk-selection">
      <th colSpan="5">Bulk Selection</th>
      {[
        {
          label: "Count",
          onUpdate: onUpdateAllTokensCountVisibility,
          icon: "fa-list-ol",
        },
        {
          label: "Tents",
          onUpdate: onUpdateAllTokenTentsVisibility,
          icon: "fa-map",
        },
        {
          label: "Tokens",
          onUpdate: onUpdateAllTokensVisibility,
          icon: "fa-user-circle",
        },
        {
          label: "Pawns",
          onUpdate: onUpdateAllPawnsVisibility,
          icon: "fa-chess-pawn",
        },
      ].map(({ label, onUpdate, icon }) => (
        <th key={label}>
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-primary">
              <input onClick={() => onUpdate(false)} type="checkbox" />
              <i className={`fas ${icon}`}></i>
            </label>
            <label className="btn btn-success">
              <input onClick={() => onUpdate(true)} type="checkbox" />
              <i className={`fas ${icon}`}></i>
            </label>
          </div>
        </th>
      ))}
      <th>
        <button
          type="button"
          className="btn btn-warning"
          onClick={() =>
            window.confirm("Are you sure you wish to remove all the tokens?") &&
            onRemoveAllTokens()
          }
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </th>
    </tr>
  );

  return (
    <>
      {tokens.length > 0 && (
        <div className="content-main">
          <table className="table table-striped" id="tokens-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Count Start</th>
                <th>Count</th>
                <th>Monster Tent</th>
                <th>Token</th>
                <th>Paper Pawn</th>
                <th>Delete</th>
              </tr>
              {renderBulkSelection()}
            </thead>
            <tbody>
              {tokens.map((token, i) => (
                <TableRow
                  key={token.id}
                  token={token}
                  shape={shape}
                  onUpdateTokenName={onUpdateTokenName}
                  onUpdateTokenSize={onUpdateTokenSize}
                  onUpdateTokenQuantity={onUpdateTokenQuantity}
                  onUpdateTokenCount={onUpdateTokenCount}
                  onUpdateTokenTentVisibility={onUpdateTokenTentVisibility}
                  onUpdateTokenVisibility={onUpdateTokenVisibility}
                  onUpdatePawnVisibility={onUpdatePawnVisibility}
                  onUpdateTokenCountStart={onUpdateTokenCountStart}
                  onRemoveToken={onRemoveToken}
                  onDownloadToken={onDownloadToken}
                />
              ))}
            </tbody>
          </table>
          <div id="table-actions-container">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              id="print-all"
              onClick={() => window.print()}
            >
              <i className="fas fa-print"></i>&nbsp;Print
            </button>
            <p>
              *In order to fit Large and Huge paper minis in an A4 page, I
              suggest customising the margins when you print the PDF (5mm
              margins should be enough).
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export { Table };
