import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { resizeAndCompressImage } from "./Utils";

describe("resizeAndCompressImage", () => {
  let originalFileReader;
  let originalImage;
  let originalCreateElement;

  beforeEach(() => {
    // Save original globals
    originalFileReader = globalThis.FileReader;
    originalImage = globalThis.Image;
    originalCreateElement = globalThis.document.createElement;
  });

  afterEach(() => {
    // Restore original globals
    globalThis.FileReader = originalFileReader;
    globalThis.Image = originalImage;
    globalThis.document.createElement = originalCreateElement;
    vi.restoreAllMocks();
  });

  it("should compress and resize a PNG file while maintaining transparency", async () => {
    // Mock FileReader
    class MockFileReader {
      readAsDataURL(file) {
        setTimeout(() => {
          if (this.onload) {
            this.onload({ target: { result: "data:image/png;base64,dummyOriginalData" } });
          }
        }, 10);
      }
    }
    globalThis.FileReader = MockFileReader;

    // Mock Image
    class MockImage {
      constructor() {
        setTimeout(() => {
          this.width = 500;
          this.height = 250;
          if (this.onload) {
            this.onload();
          }
        }, 20);
      }
    }
    globalThis.Image = MockImage;

    // Mock Canvas
    const mockContext = {
      drawImage: vi.fn(),
    };
    const mockCanvas = {
      getContext: vi.fn().mockReturnValue(mockContext),
      toDataURL: vi.fn().mockReturnValue("data:image/png;base64,dummyCompressedData"),
      width: 0,
      height: 0,
    };
    globalThis.document.createElement = vi.fn().mockImplementation((tag) => {
      if (tag === "canvas") return mockCanvas;
      return originalCreateElement.call(document, tag);
    });

    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const result = await resizeAndCompressImage(file, 200, 200, 0.8);

    expect(result).toBe("data:image/png;base64,dummyCompressedData");
    expect(mockCanvas.width).toBe(200); // 500 scaled to 200 max-width
    expect(mockCanvas.height).toBe(100); // aspect ratio preserved (500:250 -> 2:1 -> 200:100)
    expect(mockCanvas.getContext).toHaveBeenCalledWith("2d");
    expect(mockContext.drawImage).toHaveBeenCalled();
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith("image/png", 0.8);
  });

  it("should convert JPG to image/jpeg and scale using height constraint", async () => {
    // Mock FileReader
    class MockFileReader {
      readAsDataURL(file) {
        setTimeout(() => {
          if (this.onload) {
            this.onload({ target: { result: "data:image/jpeg;base64,dummyOriginalData" } });
          }
        }, 10);
      }
    }
    globalThis.FileReader = MockFileReader;

    // Mock Image (tall image: 200 width, 400 height)
    class MockImage {
      constructor() {
        setTimeout(() => {
          this.width = 200;
          this.height = 400;
          if (this.onload) {
            this.onload();
          }
        }, 20);
      }
    }
    globalThis.Image = MockImage;

    // Mock Canvas
    const mockContext = {
      drawImage: vi.fn(),
    };
    const mockCanvas = {
      getContext: vi.fn().mockReturnValue(mockContext),
      toDataURL: vi.fn().mockReturnValue("data:image/jpeg;base64,dummyCompressedData"),
      width: 0,
      height: 0,
    };
    globalThis.document.createElement = vi.fn().mockImplementation((tag) => {
      if (tag === "canvas") return mockCanvas;
      return originalCreateElement.call(document, tag);
    });

    const file = new File(["dummy content"], "test.jpg", { type: "image/jpeg" });
    const result = await resizeAndCompressImage(file, 200, 200, 0.7);

    expect(result).toBe("data:image/jpeg;base64,dummyCompressedData");
    expect(mockCanvas.width).toBe(100); // scaled to 200 max-height (200:400 -> 1:2 -> 100:200)
    expect(mockCanvas.height).toBe(200);
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith("image/jpeg", 0.7);
  });

  it("should reject if no file is provided", async () => {
    await expect(resizeAndCompressImage(null)).rejects.toThrow("No file provided");
  });
});
