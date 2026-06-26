import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { TranslationProvider } from "./hooks/useTranslation";

describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <TranslationProvider>
        <App />
      </TranslationProvider>
    );
    expect(container).toBeDefined();
  });
});
