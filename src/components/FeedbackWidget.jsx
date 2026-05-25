import React, { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

const FeedbackWidget = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success
  const [validationError, setValidationError] = useState("");

  // Web3Forms Access Key to hide the raw email completely
  const web3FormsAccessKey = "98696409-ebda-45d5-9ac6-8d91cde81a3d";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!message.trim()) {
      setValidationError(t("feedbackValidationMessage"));
      return;
    }

    // 1. Honeypot check: If the hidden honeypot input is filled by a bot, silent fail
    const botcheckField = e.target.querySelector('input[name="botcheck"]');
    if (botcheckField && botcheckField.checked) {
      // Trick the bot into thinking it succeeded without sending API requests
      setStatus("success");
      setMessage("");
      setEmail("");
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
      }, 5000);
      return;
    }

    // 2. Cooldown check: Prevent rapid submission spamming
    try {
      const lastTime = localStorage.getItem("rpg_tokens_last_feedback");
      if (lastTime) {
        const timePassed = Date.now() - Number(lastTime);
        const cooldown = 2 * 60 * 1000; // 2 minutes cooldown
        if (timePassed < cooldown) {
          setValidationError(t("feedbackRateLimit"));
          return;
        }
      }
    } catch (err) {}

    setStatus("sending");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsAccessKey,
          email: email.trim() || "Anonymous GM",
          message: message.trim(),
          subject: "New Suggestion - Paper Tokens Generator",
          from_name: "Paper Tokens Generator",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setMessage("");
        setEmail("");

        // Record timestamp of successful dispatch
        try {
          localStorage.setItem("rpg_tokens_last_feedback", Date.now().toString());
        } catch (err) {}

        // Auto close drawer after 5 seconds on success
        setTimeout(() => {
          setIsOpen(false);
          setStatus("idle");
        }, 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Feedback dispatch error:", error);
      setStatus("error");
    }
  };

  return (
    <div id="feedback-widget-container">
      {/* Floating Action Button */}
      <button
        id="feedback-trigger-btn"
        className={isOpen ? "active" : ""}
        aria-label="Toggle Feedback Widget"
        onClick={() => {
          setIsOpen(!isOpen);
          if (status === "success" || status === "error") setStatus("idle");
        }}
      >
        <i className={isOpen ? "fas fa-times" : "fas fa-comment-alt"}></i>
        {!isOpen && (
          <span className="feedback-badge">
            <i className="fas fa-envelope" style={{ marginRight: "6px" }}></i>
            Feedback
          </span>
        )}
      </button>

      {/* Slide-up Popover Card */}
      {isOpen && (
        <div id="feedback-popover-card">
          <div className="feedback-header">
            <h3>{t("feedbackTitle")}</h3>
          </div>

          {status === "success" ? (
            <div className="feedback-success-state">
              <i className="fas fa-check-circle success-icon"></i>
              <p>{t("feedbackSuccess")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="feedback-form">
              {/* Invisible Honeypot field for bot spam protection */}
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                style={{ display: "none" }}
                tabIndex="-1"
                autoComplete="off"
              />
              <div className="form-group">
                <label htmlFor="feedback-message">{t("feedbackLabelMessage")} *</label>
                <textarea
                  id="feedback-message"
                  className="form-control"
                  rows="4"
                  placeholder={t("feedbackPlaceholderMessage")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={status === "sending"}
                ></textarea>
                {validationError && <span className="validation-error">{validationError}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="feedback-email">{t("feedbackLabelEmail")}</label>
                <input
                  id="feedback-email"
                  type="email"
                  className="form-control"
                  placeholder={t("feedbackPlaceholderEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "sending"}
                />
              </div>

              {status === "error" && (
                <div className="error-message">
                  <i className="fas fa-exclamation-triangle"></i> {t("feedbackError")}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-block feedback-submit-btn"
                disabled={status === "sending"}
              >
                {status === "sending" ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> {t("feedbackBtnSending")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> {t("feedbackBtnSend")}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackWidget;
