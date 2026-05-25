import React, { memo, useEffect } from "react";
import { TableRow } from "./TableRow";
import { useTranslation } from "../hooks/useTranslation";

const Table = ({
  tokens,
  shape,
  onUpdateAllTokensCountVisibility,
  onUpdateAllTokenTentsVisibility,
  onUpdateAllTokensVisibility,
  onUpdateAllMinisVisibility,
  onRemoveAllTokens,
  onUpdateTokenName,
  onUpdateTokenSize,
  onUpdateTokenQuantity,
  onUpdateTokenCount,
  onUpdateTokenTentVisibility,
  onUpdateTokenVisibility,
  onUpdateMiniVisibility,
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
          label: t("bulkMinis"),
          onUpdate: onUpdateAllMinisVisibility,
          icon: "fa-chess-mini",
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
                <th className="tooltip-trigger">
                  <div className="tooltip-wrapper">
                    <span>{t("thImage")}</span>
                    <i className="far fa-question-circle tooltip-icon"></i>
                  </div>
                  <span className="tooltip-bubble">{t("tooltipImage")}</span>
                </th>
                <th className="tooltip-trigger">
                  <div className="tooltip-wrapper">
                    <span>{t("thName")}</span>
                    <i className="far fa-question-circle tooltip-icon"></i>
                  </div>
                  <span className="tooltip-bubble">{t("tooltipName")}</span>
                </th>
                <th className="tooltip-trigger">
                  <div className="tooltip-wrapper">
                    <span>{t("thSize")}</span>
                    <i className="far fa-question-circle tooltip-icon"></i>
                  </div>
                  <span className="tooltip-bubble">{t("tooltipSize")}</span>
                </th>
                <th className="tooltip-trigger">
                  <div className="tooltip-wrapper">
                    <span>{t("thQuantity")}</span>
                    <i className="far fa-question-circle tooltip-icon"></i>
                  </div>
                  <span className="tooltip-bubble">{t("tooltipQuantity")}</span>
                </th>
                <th className="tooltip-trigger">
                  <div className="tooltip-wrapper">
                    <span>{t("thCountStart")}</span>
                    <i className="far fa-question-circle tooltip-icon"></i>
                  </div>
                  <span className="tooltip-bubble">{t("tooltipCountStart")}</span>
                </th>
                <th className="tooltip-trigger">
                  <div className="tooltip-wrapper">
                    <span>{t("thCount")}</span>
                    <i className="far fa-question-circle tooltip-icon"></i>
                  </div>
                  <span className="tooltip-bubble">{t("tooltipCount")}</span>
                </th>
                <th className="tooltip-trigger">
                  <div className="tooltip-wrapper">
                    <span>{t("thMonsterTent")}</span>
                    <i className="far fa-question-circle tooltip-icon"></i>
                  </div>
                  <span className="tooltip-bubble">{t("tooltipMonsterTent")}</span>
                </th>
                <th className="tooltip-trigger">
                  <div className="tooltip-wrapper">
                    <span>{t("thToken")}</span>
                    <i className="far fa-question-circle tooltip-icon"></i>
                  </div>
                  <span className="tooltip-bubble">{t("tooltipToken")}</span>
                </th>
                <th className="tooltip-trigger">
                  <div className="tooltip-wrapper">
                    <span>{t("thPaperMini")}</span>
                    <i className="far fa-question-circle tooltip-icon"></i>
                  </div>
                  <span className="tooltip-bubble">{t("tooltipPaperMini")}</span>
                </th>
                <th className="tooltip-trigger">
                  <div className="tooltip-wrapper">
                    <span>{t("thDownload")}</span>
                    <i className="far fa-question-circle tooltip-icon"></i>
                  </div>
                  <span className="tooltip-bubble">{t("tooltipDownload")}</span>
                </th>
                <th className="tooltip-trigger">
                  <div className="tooltip-wrapper">
                    <span>{t("thDelete")}</span>
                    <i className="far fa-question-circle tooltip-icon"></i>
                  </div>
                  <span className="tooltip-bubble">{t("tooltipDelete")}</span>
                </th>
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
                  onUpdateMiniVisibility={onUpdateMiniVisibility}
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
