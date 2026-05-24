import React, { memo, useEffect } from "react";
import { TableRow } from "./TableRow";
import { useTranslation } from "../hooks/useTranslation";

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
  onUpdateTokenProperty,
}) => {
  const { t } = useTranslation();

  const renderBulkSelection = () => (
    <tr id="bulk-selection">
      <th colSpan="5">{t("bulkSelection")}</th>
      {[
        {
          label: t("thCount"),
          onUpdate: onUpdateAllTokensCountVisibility,
          icon: "fa-list-ol",
        },
        {
          label: t("bulkTents"),
          onUpdate: onUpdateAllTokenTentsVisibility,
          icon: "fa-map",
        },
        {
          label: t("bulkTokens"),
          onUpdate: onUpdateAllTokensVisibility,
          icon: "fa-user-circle",
        },
        {
          label: t("bulkPawns"),
          onUpdate: onUpdateAllPawnsVisibility,
          icon: "fa-chess-pawn",
        },
      ].map(({ label, onUpdate, icon }) => (
        <th key={label}>
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-primary">
              <input onClick={() => onUpdate(false)} type="checkbox" />
              <i className="fas fa-ban"></i>
            </label>
            <label className="btn btn-success">
              <input onClick={() => onUpdate(true)} type="checkbox" />
              <i className={`fas ${icon}`}></i>
            </label>
          </div>
        </th>
      ))}
      <th></th>
      <th>
        <button
          type="button"
          className="btn btn-warning"
          onClick={() =>
            window.confirm(t("confirmDeleteAll")) &&
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
                <th>{t("thImage")}</th>
                <th>{t("thName")}</th>
                <th>{t("thSize")}</th>
                <th>{t("thQuantity")}</th>
                <th>{t("thCountStart")}</th>
                <th>{t("thCount")}</th>
                <th>{t("thMonsterTent")}</th>
                <th>{t("thToken")}</th>
                <th>{t("thPaperPawn")}</th>
                <th>{t("thDownload")}</th>
                <th>{t("thDelete")}</th>
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
                  onUpdateTokenProperty={onUpdateTokenProperty}
                />
              ))}
            </tbody>
          </table>

        </div>
      )}
    </>
  );
};

export { Table };
