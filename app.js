/**
 * Painter's Reference Lab
 * Phase 7: Composite Export + PWA
 *
 * Adds:
 * - Export Sheet 1: Original / Grayscale / Notan / Outline (+ grid only on outline)
 * - Export Sheet 2: Original / Light Mask / Midtone Mask / Shadow Mask
 */

const SUPPORTED_TYPES = ["image/jpeg", "image/png"];

function isSupportedImageFile(file) {
  return Boolean(file && SUPPORTED_TYPES.includes(file.type));
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function createImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not create image element."));
    image.src = src;
  });
}

async function fileToImageElement(file) {
  const dataUrl = await readFileAsDataURL(file);
  return createImageElement(dataUrl);
}

/* ---------------------------------
   Canvas utilities
--------------------------------- */

function setCanvasSize(canvas, width, height) {
  const safeWidth = Math.max(1, Math.round(width));
  const safeHeight = Math.max(1, Math.round(height));
  canvas.width = safeWidth;
  canvas.height = safeHeight;
}

function clearCanvas(ctx, canvas) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function computeContainSize(sourceWidth, sourceHeight, maxWidth, maxHeight) {
  if (sourceWidth <= 0 || sourceHeight <= 0) {
    return { width: 1, height: 1, scale: 1 };
  }

  const widthRatio = maxWidth / sourceWidth;
  const heightRatio = maxHeight / sourceHeight;
  const scale = Math.min(widthRatio, heightRatio, 1);

  return {
    width: Math.round(sourceWidth * scale),
    height: Math.round(sourceHeight * scale),
    scale
  };
}

function drawImageContained(ctx, image, canvas) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;

  const fitted = computeContainSize(
    sourceWidth,
    sourceHeight,
    canvas.width,
    canvas.height
  );

  const offsetX = Math.round((canvas.width - fitted.width) / 2);
  const offsetY = Math.round((canvas.height - fitted.height) / 2);

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, offsetX, offsetY, fitted.width, fitted.height);
  ctx.restore();
}

function getScalePercentage(scale) {
  return `${Math.round(scale * 100)}%`;
}

function createOffscreenCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/* ---------------------------------
   Grayscale processing
--------------------------------- */

function createGrayscaleCanvasFromCanvas(sourceCanvas) {
  const outputCanvas = createOffscreenCanvas(sourceCanvas.width, sourceCanvas.height);
  const outputCtx = outputCanvas.getContext("2d", { willReadFrequently: true });

  outputCtx.drawImage(sourceCanvas, 0, 0);

  const imageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = Math.round((0.299 * r) + (0.587 * g) + (0.114 * b));

    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  outputCtx.putImageData(imageData, 0, 0);
  return outputCanvas;
}

/* ---------------------------------
   3-value Notan processing
--------------------------------- */

function createNotanCanvasFromGrayscaleCanvas(grayscaleCanvas) {
  const outputCanvas = createOffscreenCanvas(grayscaleCanvas.width, grayscaleCanvas.height);
  const outputCtx = outputCanvas.getContext("2d", { willReadFrequently: true });

  outputCtx.drawImage(grayscaleCanvas, 0, 0);

  const imageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const value = data[i];
    let posterized = 255;

    if (value <= 85) {
      posterized = 0;
    } else if (value <= 170) {
      posterized = 127;
    }

    data[i] = posterized;
    data[i + 1] = posterized;
    data[i + 2] = posterized;
  }

  outputCtx.putImageData(imageData, 0, 0);
  return outputCanvas;
}

/* ---------------------------------
   Tonal mask processing
--------------------------------- */

function createTintedMaskCanvasFromGrayscaleCanvas(grayscaleCanvas, maskType) {
  const outputCanvas = createOffscreenCanvas(grayscaleCanvas.width, grayscaleCanvas.height);
  const outputCtx = outputCanvas.getContext("2d", { willReadFrequently: true });

  const imageData = outputCtx.createImageData(outputCanvas.width, outputCanvas.height);
  const { data } = imageData;

  const sourceCtx = grayscaleCanvas.getContext("2d", { willReadFrequently: true });
  const sourceData = sourceCtx.getImageData(0, 0, grayscaleCanvas.width, grayscaleCanvas.height).data;

  const palette = {
    light: { active: [255, 255, 255], inactive: [234, 229, 216] },
    midtone: { active: [245, 225, 140], inactive: [255, 250, 232] },
    shadow: { active: [45, 40, 36], inactive: [236, 232, 226] }
  };

  const colors = palette[maskType];

  for (let i = 0; i < sourceData.length; i += 4) {
    const value = sourceData[i];
    let isActive = false;

    if (maskType === "light") {
      isActive = value >= 171;
    } else if (maskType === "midtone") {
      isActive = value >= 86 && value <= 170;
    } else if (maskType === "shadow") {
      isActive = value <= 85;
    }

    const fill = isActive ? colors.active : colors.inactive;

    data[i] = fill[0];
    data[i + 1] = fill[1];
    data[i + 2] = fill[2];
    data[i + 3] = 255;
  }

  outputCtx.putImageData(imageData, 0, 0);
  return outputCanvas;
}

/* ---------------------------------
   Outline sketch processing
--------------------------------- */

function getOutlinePresetSettings(detailLevel) {
  const presets = {
    low: {
      label: "Low Detail",
      blurPasses: 2,
      threshold: 150
    },
    medium: {
      label: "Medium Detail",
      blurPasses: 1,
      threshold: 120
    },
    high: {
      label: "High Detail",
      blurPasses: 1,
      threshold: 90
    }
  };

  return presets[detailLevel] || presets.medium;
}

function blurGrayscaleCanvasOnce(sourceCanvas) {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;

  const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  const sourceImageData = sourceCtx.getImageData(0, 0, width, height);
  const src = sourceImageData.data;

  const outputCanvas = createOffscreenCanvas(width, height);
  const outputCtx = outputCanvas.getContext("2d", { willReadFrequently: true });
  const outputImageData = outputCtx.createImageData(width, height);
  const out = outputImageData.data;

  const getGrayAt = (x, y) => {
    const clampedX = Math.max(0, Math.min(width - 1, x));
    const clampedY = Math.max(0, Math.min(height - 1, y));
    const index = (clampedY * width + clampedX) * 4;
    return src[index];
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let sum = 0;

      for (let ky = -1; ky <= 1; ky += 1) {
        for (let kx = -1; kx <= 1; kx += 1) {
          sum += getGrayAt(x + kx, y + ky);
        }
      }

      const blurred = Math.round(sum / 9);
      const index = (y * width + x) * 4;

      out[index] = blurred;
      out[index + 1] = blurred;
      out[index + 2] = blurred;
      out[index + 3] = 255;
    }
  }

  outputCtx.putImageData(outputImageData, 0, 0);
  return outputCanvas;
}

function createBlurredGrayscaleCanvas(sourceCanvas, blurPasses) {
  let currentCanvas = sourceCanvas;

  for (let i = 0; i < blurPasses; i += 1) {
    currentCanvas = blurGrayscaleCanvasOnce(currentCanvas);
  }

  return currentCanvas;
}

function createOutlineSketchCanvasFromGrayscaleCanvas(grayscaleCanvas, detailLevel) {
  const preset = getOutlinePresetSettings(detailLevel);
  const blurredCanvas = createBlurredGrayscaleCanvas(grayscaleCanvas, preset.blurPasses);

  const width = blurredCanvas.width;
  const height = blurredCanvas.height;

  const sourceCtx = blurredCanvas.getContext("2d", { willReadFrequently: true });
  const sourceImageData = sourceCtx.getImageData(0, 0, width, height);
  const src = sourceImageData.data;

  const outputCanvas = createOffscreenCanvas(width, height);
  const outputCtx = outputCanvas.getContext("2d", { willReadFrequently: true });
  const outputImageData = outputCtx.createImageData(width, height);
  const out = outputImageData.data;

  const getGrayAt = (x, y) => {
    const clampedX = Math.max(0, Math.min(width - 1, x));
    const clampedY = Math.max(0, Math.min(height - 1, y));
    const index = (clampedY * width + clampedX) * 4;
    return src[index];
  };

  const sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];

  const sobelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let gx = 0;
      let gy = 0;

      for (let ky = -1; ky <= 1; ky += 1) {
        for (let kx = -1; kx <= 1; kx += 1) {
          const gray = getGrayAt(x + kx, y + ky);
          gx += gray * sobelX[ky + 1][kx + 1];
          gy += gray * sobelY[ky + 1][kx + 1];
        }
      }

      const magnitude = Math.sqrt((gx * gx) + (gy * gy));
      const isEdge = magnitude >= preset.threshold;
      const outputValue = isEdge ? 0 : 255;
      const index = (y * width + x) * 4;

      out[index] = outputValue;
      out[index + 1] = outputValue;
      out[index + 2] = outputValue;
      out[index + 3] = 255;
    }
  }

  outputCtx.putImageData(outputImageData, 0, 0);
  return outputCanvas;
}

/* ---------------------------------
   Grid overlay utilities
--------------------------------- */

function drawGridOverlay(ctx, canvas, options) {
  const { rows, columns, color, lineThickness, opacity } = options;

  const cellWidth = canvas.width / columns;
  const cellHeight = canvas.height / rows;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = opacity;
  ctx.lineWidth = lineThickness;

  for (let col = 1; col < columns; col += 1) {
    const x = col * cellWidth;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let row = 1; row < rows; row += 1) {
    const y = row * cellHeight;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

/* ---------------------------------
   Export utilities
--------------------------------- */

function downloadCanvas(canvas, filename, mimeType, quality = 0.92) {
  const link = document.createElement("a");

  if (typeof canvas.toBlob === "function") {
    canvas.toBlob((blob) => {
      if (!blob) {
        alert("The export could not be generated.");
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      link.download = filename;
      link.click();

      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);
    }, mimeType, quality);
    return;
  }

  link.href = canvas.toDataURL(mimeType, quality);
  link.download = filename;
  link.click();
}

function drawPanel(ctx, panelCanvas, x, y, width, height, label, options = {}) {
  const {
    showGrid = false,
    gridOptions = null,
    labelHeight = 38
  } = options;

  ctx.save();

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, width, height);

  const imageAreaHeight = height - labelHeight;
  const fitted = computeContainSize(panelCanvas.width, panelCanvas.height, width, imageAreaHeight);

  const drawX = x + Math.round((width - fitted.width) / 2);
  const drawY = y + Math.round((imageAreaHeight - fitted.height) / 2);

  ctx.drawImage(panelCanvas, drawX, drawY, fitted.width, fitted.height);

  if (showGrid && gridOptions) {
    const overlayCanvas = createOffscreenCanvas(fitted.width, fitted.height);
    const overlayCtx = overlayCanvas.getContext("2d");
    clearCanvas(overlayCtx, overlayCanvas);
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    drawGridOverlay(overlayCtx, overlayCanvas, gridOptions);
    ctx.drawImage(overlayCanvas, drawX, drawY);
  }

  ctx.strokeStyle = "#d9d2c4";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, imageAreaHeight);

  ctx.fillStyle = "#2f2a24";
  ctx.font = "600 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + width / 2, y + imageAreaHeight + (labelHeight / 2));

  ctx.restore();
}

function createCompositeSheet(panels, filename, options = {}) {
  const {
    title = "Painter's Reference Lab",
    sheetWidth = 1800,
    margin = 60,
    gutter = 40,
    topTitleHeight = 60,
    bottomMargin = 40,
    labelHeight = 38,
    panelAspectRatio = 0.75
  } = options;

  const columns = 2;
  const rows = 2;
  const panelWidth = Math.floor((sheetWidth - (margin * 2) - gutter) / columns);
  const panelImageHeight = Math.round(panelWidth * panelAspectRatio);
  const panelHeight = panelImageHeight + labelHeight;
  const sheetHeight =
    topTitleHeight + margin + (rows * panelHeight) + gutter + bottomMargin;

  const sheetCanvas = createOffscreenCanvas(sheetWidth, sheetHeight);
  const ctx = sheetCanvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

  ctx.fillStyle = "#2f2a24";
  ctx.font = "700 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(title, margin, Math.round(topTitleHeight / 2));

  panels.forEach((panel, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const x = margin + col * (panelWidth + gutter);
    const y = topTitleHeight + margin + row * (panelHeight + gutter);

    drawPanel(ctx, panel.canvas, x, y, panelWidth, panelHeight, panel.label, {
      showGrid: panel.showGrid,
      gridOptions: panel.gridOptions,
      labelHeight
    });
  });

  downloadCanvas(sheetCanvas, filename, "image/jpeg", 0.92);
}

/* ---------------------------------
   App controller
--------------------------------- */

class PaintersReferenceApp {
  constructor() {
    this.dom = {
      imageInput: document.getElementById("imageInput"),
      mainCanvas: document.getElementById("mainCanvas"),
      canvasPlaceholder: document.getElementById("canvasPlaceholder"),
      statusText: document.getElementById("statusText"),
      originalSizeText: document.getElementById("originalSizeText"),
      canvasSizeText: document.getElementById("canvasSizeText"),
      scaleText: document.getElementById("scaleText"),
      viewModeText: document.getElementById("viewModeText"),
      outlineDetailText: document.getElementById("outlineDetailText"),

      showGridInput: document.getElementById("showGridInput"),
      rowsInput: document.getElementById("rowsInput"),
      columnsInput: document.getElementById("columnsInput"),
      viewModeSelect: document.getElementById("viewModeSelect"),
      outlineDetailSelect: document.getElementById("outlineDetailSelect"),

      exportSheet1Button: document.getElementById("exportSheet1Button"),
      exportSheet2Button: document.getElementById("exportSheet2Button")
    };

    this.ctx = this.dom.mainCanvas.getContext("2d", { alpha: false });

    this.state = {
      originalImage: null,
      originalWidth: 0,
      originalHeight: 0,
      workingCanvasWidth: 0,
      workingCanvasHeight: 0,
      workingScale: 1,
      viewMode: "original",
      outlineDetail: "medium",
      processed: {
        originalCanvas: null,
        grayscaleCanvas: null,
        notanCanvas: null,
        lightMaskCanvas: null,
        midtoneMaskCanvas: null,
        shadowMaskCanvas: null,
        outlineSketchLowCanvas: null,
        outlineSketchMediumCanvas: null,
        outlineSketchHighCanvas: null
      },
      grid: {
        show: true,
        rows: 3,
        columns: 3,
        color: "#444444",
        lineThickness: 2.5,
        opacity: 1
      }
    };

    this.maxCanvasDimension = 1600;

    this.bindEvents();
    this.initializeCanvas();
    this.syncControls();
  }

  bindEvents() {
    this.dom.imageInput.addEventListener("change", async (event) => {
      const [file] = event.target.files || [];
      if (!file) return;
      await this.handleImageSelection(file);
    });

    this.dom.showGridInput.addEventListener("change", () => {
      this.state.grid.show = this.dom.showGridInput.checked;
      this.renderScene();
    });

    this.dom.rowsInput.addEventListener("input", () => {
      this.state.grid.rows = this.getSafeInteger(this.dom.rowsInput.value, 3, 1, 50);
      this.dom.rowsInput.value = this.state.grid.rows;
      this.renderScene();
    });

    this.dom.columnsInput.addEventListener("input", () => {
      this.state.grid.columns = this.getSafeInteger(this.dom.columnsInput.value, 3, 1, 50);
      this.dom.columnsInput.value = this.state.grid.columns;
      this.renderScene();
    });

    this.dom.viewModeSelect.addEventListener("change", () => {
      this.state.viewMode = this.dom.viewModeSelect.value;
      this.updateViewModeLabel();
      this.renderScene();
    });

    this.dom.outlineDetailSelect.addEventListener("change", () => {
      this.state.outlineDetail = this.dom.outlineDetailSelect.value;
      this.updateOutlineDetailLabel();
      this.renderScene();
    });

    this.dom.exportSheet1Button.addEventListener("click", () => {
      this.exportSheet1();
    });

    this.dom.exportSheet2Button.addEventListener("click", () => {
      this.exportSheet2();
    });
  }

  initializeCanvas() {
    setCanvasSize(this.dom.mainCanvas, 960, 640);
    clearCanvas(this.ctx, this.dom.mainCanvas);
    this.updateStatus("Waiting for image");
    this.updateViewModeLabel();
    this.updateOutlineDetailLabel();
  }

  syncControls() {
    this.dom.showGridInput.checked = this.state.grid.show;
    this.dom.rowsInput.value = this.state.grid.rows;
    this.dom.columnsInput.value = this.state.grid.columns;
    this.dom.viewModeSelect.value = this.state.viewMode;
    this.dom.outlineDetailSelect.value = this.state.outlineDetail;
    this.updateViewModeLabel();
    this.updateOutlineDetailLabel();
  }

  updateViewModeLabel() {
    const labels = {
      original: "Original",
      grayscale: "Grayscale",
      notan: "3-Value Notan",
      lightMask: "Light Mask",
      midtoneMask: "Midtone Mask",
      shadowMask: "Shadow Mask",
      outlineSketch: "Rough Outline Sketch"
    };

    this.dom.viewModeText.textContent = labels[this.state.viewMode] || "Original";
  }

  updateOutlineDetailLabel() {
    this.dom.outlineDetailText.textContent =
      getOutlinePresetSettings(this.state.outlineDetail).label;
  }

  getSafeInteger(value, fallback, min, max) {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) return fallback;
    return Math.min(Math.max(parsed, min), max);
  }

  async handleImageSelection(file) {
    if (!isSupportedImageFile(file)) {
      this.updateStatus("Unsupported file type");
      alert("Please choose a JPG or PNG image.");
      return;
    }

    this.updateStatus("Loading image...");

    try {
      const image = await fileToImageElement(file);

      this.state.originalImage = image;
      this.state.originalWidth = image.naturalWidth;
      this.state.originalHeight = image.naturalHeight;

      this.prepareWorkingCanvases();
      this.renderScene();

      this.dom.canvasPlaceholder.classList.add("is-hidden");
      this.updateStatus("Image loaded");
    } catch (error) {
      console.error("Image loading failed:", error);
      this.updateStatus("Failed to load image");
      alert("The image could not be loaded.");
    }
  }

  prepareWorkingCanvases() {
    const image = this.state.originalImage;
    if (!image) return;

    const contained = computeContainSize(
      image.naturalWidth,
      image.naturalHeight,
      this.maxCanvasDimension,
      this.maxCanvasDimension
    );

    const originalCanvas = createOffscreenCanvas(contained.width, contained.height);
    const originalCtx = originalCanvas.getContext("2d");

    clearCanvas(originalCtx, originalCanvas);
    drawImageContained(originalCtx, image, originalCanvas);

    const grayscaleCanvas = createGrayscaleCanvasFromCanvas(originalCanvas);
    const notanCanvas = createNotanCanvasFromGrayscaleCanvas(grayscaleCanvas);

    const lightMaskCanvas = createTintedMaskCanvasFromGrayscaleCanvas(grayscaleCanvas, "light");
    const midtoneMaskCanvas = createTintedMaskCanvasFromGrayscaleCanvas(grayscaleCanvas, "midtone");
    const shadowMaskCanvas = createTintedMaskCanvasFromGrayscaleCanvas(grayscaleCanvas, "shadow");

    const outlineSketchLowCanvas =
      createOutlineSketchCanvasFromGrayscaleCanvas(grayscaleCanvas, "low");
    const outlineSketchMediumCanvas =
      createOutlineSketchCanvasFromGrayscaleCanvas(grayscaleCanvas, "medium");
    const outlineSketchHighCanvas =
      createOutlineSketchCanvasFromGrayscaleCanvas(grayscaleCanvas, "high");

    this.state.processed.originalCanvas = originalCanvas;
    this.state.processed.grayscaleCanvas = grayscaleCanvas;
    this.state.processed.notanCanvas = notanCanvas;
    this.state.processed.lightMaskCanvas = lightMaskCanvas;
    this.state.processed.midtoneMaskCanvas = midtoneMaskCanvas;
    this.state.processed.shadowMaskCanvas = shadowMaskCanvas;
    this.state.processed.outlineSketchLowCanvas = outlineSketchLowCanvas;
    this.state.processed.outlineSketchMediumCanvas = outlineSketchMediumCanvas;
    this.state.processed.outlineSketchHighCanvas = outlineSketchHighCanvas;

    this.state.workingCanvasWidth = contained.width;
    this.state.workingCanvasHeight = contained.height;
    this.state.workingScale = contained.scale;
  }

  getActiveOutlineCanvas() {
    if (this.state.outlineDetail === "low") {
      return this.state.processed.outlineSketchLowCanvas;
    }
    if (this.state.outlineDetail === "high") {
      return this.state.processed.outlineSketchHighCanvas;
    }
    return this.state.processed.outlineSketchMediumCanvas;
  }

  getActiveBaseCanvas() {
    const map = {
      original: this.state.processed.originalCanvas,
      grayscale: this.state.processed.grayscaleCanvas,
      notan: this.state.processed.notanCanvas,
      lightMask: this.state.processed.lightMaskCanvas,
      midtoneMask: this.state.processed.midtoneMaskCanvas,
      shadowMask: this.state.processed.shadowMaskCanvas,
      outlineSketch: this.getActiveOutlineCanvas()
    };

    return map[this.state.viewMode] || this.state.processed.originalCanvas;
  }

  renderScene() {
    const baseCanvas = this.getActiveBaseCanvas();
    if (!baseCanvas) return;

    setCanvasSize(this.dom.mainCanvas, baseCanvas.width, baseCanvas.height);
    clearCanvas(this.ctx, this.dom.mainCanvas);
    this.ctx.drawImage(baseCanvas, 0, 0);

    if (this.state.grid.show) {
      drawGridOverlay(this.ctx, this.dom.mainCanvas, this.state.grid);
    }

    this.updateInfo();
    this.updateViewModeLabel();
    this.updateOutlineDetailLabel();
  }

  updateInfo() {
    this.dom.originalSizeText.textContent =
      `${this.state.originalWidth} × ${this.state.originalHeight}px`;

    this.dom.canvasSizeText.textContent =
      `${this.state.workingCanvasWidth} × ${this.state.workingCanvasHeight}px`;

    this.dom.scaleText.textContent =
      getScalePercentage(this.state.workingScale);
  }

  updateStatus(message) {
    this.dom.statusText.textContent = message;
  }

  exportSheet1() {
    if (!this.state.processed.originalCanvas) {
      alert("Please load an image before exporting.");
      return;
    }

    createCompositeSheet(
      [
        {
          label: "Original",
          canvas: this.state.processed.originalCanvas,
          showGrid: false
        },
        {
          label: "Grayscale",
          canvas: this.state.processed.grayscaleCanvas,
          showGrid: false
        },
        {
          label: "3-Value Notan",
          canvas: this.state.processed.notanCanvas,
          showGrid: false
        },
        {
          label: `Outline (${getOutlinePresetSettings(this.state.outlineDetail).label})`,
          canvas: this.getActiveOutlineCanvas(),
          showGrid: true,
          gridOptions: this.state.grid
        }
      ],
      "painters-ref-sheet-1.jpg",
      {
        title: "Painter's Reference Lab — Sheet 1"
      }
    );
  }

  exportSheet2() {
    if (!this.state.processed.originalCanvas) {
      alert("Please load an image before exporting.");
      return;
    }

    createCompositeSheet(
      [
        {
          label: "Original",
          canvas: this.state.processed.originalCanvas,
          showGrid: false
        },
        {
          label: "Light Mask",
          canvas: this.state.processed.lightMaskCanvas,
          showGrid: false
        },
        {
          label: "Midtone Mask",
          canvas: this.state.processed.midtoneMaskCanvas,
          showGrid: false
        },
        {
          label: "Shadow Mask",
          canvas: this.state.processed.shadowMaskCanvas,
          showGrid: false
        }
      ],
      "painters-ref-sheet-2.jpg",
      {
        title: "Painter's Reference Lab — Sheet 2"
      }
    );
  }
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js");
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  new PaintersReferenceApp();
  registerServiceWorker();
});
