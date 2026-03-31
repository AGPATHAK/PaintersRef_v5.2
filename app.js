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

function createNotanCanvasFromGrayscaleCanvas(grayscaleCanvas, options = {}) {
  const {
    shadowCutoff = 85,
    lightCutoff = 170
  } = options;
  const outputCanvas = createOffscreenCanvas(grayscaleCanvas.width, grayscaleCanvas.height);
  const outputCtx = outputCanvas.getContext("2d", { willReadFrequently: true });

  outputCtx.drawImage(grayscaleCanvas, 0, 0);

  const imageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const value = data[i];
    let posterized = 255;

    if (value <= shadowCutoff) {
      posterized = 0;
    } else if (value < lightCutoff) {
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
      label: "Low",
      sensitivity: 30,
      smoothing: 2
    },
    medium: {
      label: "Medium",
      sensitivity: 60,
      smoothing: 1
    },
    high: {
      label: "High",
      sensitivity: 90,
      smoothing: 0
    }
  };

  return presets[detailLevel] || presets.medium;
}

function getMatchingOutlinePresetKey(outlineOptions) {
  const presetKeys = ["low", "medium", "high"];

  for (const presetKey of presetKeys) {
    const preset = getOutlinePresetSettings(presetKey);
    if (
      preset.sensitivity === outlineOptions.sensitivity &&
      preset.smoothing === outlineOptions.smoothing
    ) {
      return presetKey;
    }
  }

  return null;
}

function getOutlineDisplayLabel(outlineOptions) {
  const presetKey = getMatchingOutlinePresetKey(outlineOptions);
  if (presetKey) {
    return getOutlinePresetSettings(presetKey).label;
  }

  return "Custom";
}

function getOutlineRenderSettings(outlineOptions) {
  const sensitivity = clamp(outlineOptions.sensitivity, 10, 120);
  const smoothing = clamp(outlineOptions.smoothing, 0, 3);

  return {
    sensitivity,
    smoothing,
    threshold: clamp(180 - sensitivity, 40, 170),
    blurPasses: smoothing
  };
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

function createOutlineSketchCanvasFromGrayscaleCanvas(grayscaleCanvas, outlineOptions) {
  const settings = getOutlineRenderSettings(outlineOptions);
  const blurredCanvas = createBlurredGrayscaleCanvas(grayscaleCanvas, settings.blurPasses);

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
      const isEdge = magnitude >= settings.threshold;
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

function createMirroredCanvasFromCanvas(sourceCanvas) {
  const outputCanvas = createOffscreenCanvas(sourceCanvas.width, sourceCanvas.height);
  const outputCtx = outputCanvas.getContext("2d");

  outputCtx.save();
  outputCtx.translate(sourceCanvas.width, 0);
  outputCtx.scale(-1, 1);
  outputCtx.drawImage(sourceCanvas, 0, 0);
  outputCtx.restore();

  return outputCanvas;
}

function createSquintCanvasFromCanvas(sourceCanvas, options = {}) {
  const { softness = 35 } = options;
  const clampedSoftness = clamp(softness, 0, 100);
  const totalPasses = (clampedSoftness / 100) * 4;
  const wholePasses = Math.floor(totalPasses);
  const blendAmount = totalPasses - wholePasses;

  let baseCanvas = sourceCanvas;
  if (wholePasses > 0) {
    baseCanvas = createBlurredGrayscaleCanvas(sourceCanvas, wholePasses);
  }

  const outputCanvas = createOffscreenCanvas(sourceCanvas.width, sourceCanvas.height);
  const outputCtx = outputCanvas.getContext("2d");
  outputCtx.drawImage(baseCanvas, 0, 0);

  if (blendAmount > 0.001) {
    const nextCanvas = createBlurredGrayscaleCanvas(baseCanvas, 1);
    outputCtx.save();
    outputCtx.globalAlpha = blendAmount;
    outputCtx.drawImage(nextCanvas, 0, 0);
    outputCtx.restore();
  }

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
    labelHeight = 38,
    overlayDrawer = null,
    sublabel = ""
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

  if (typeof overlayDrawer === "function") {
    overlayDrawer(ctx, {
      x: drawX,
      y: drawY,
      width: fitted.width,
      height: fitted.height
    });
  }

  ctx.strokeStyle = "#d9d2c4";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, imageAreaHeight);

  ctx.fillStyle = "#2f2a24";
  ctx.font = "600 18px 'Avenir Next', Avenir, Aptos, 'Helvetica Neue', Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = sublabel ? "alphabetic" : "middle";
  if (sublabel) {
    const labelBaseY = y + imageAreaHeight + 24;
    ctx.fillText(label, x + width / 2, labelBaseY);

    ctx.fillStyle = "#6f665c";
    ctx.font = "500 13px 'Avenir Next', Avenir, Aptos, 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.fillText(sublabel, x + width / 2, labelBaseY + 19);
  } else {
    ctx.fillText(label, x + width / 2, y + imageAreaHeight + (labelHeight / 2));
  }

  ctx.restore();

  return {
    x: drawX,
    y: drawY,
    width: fitted.width,
    height: fitted.height
  };
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
  ctx.font = "700 28px 'Avenir Next', Avenir, Aptos, 'Helvetica Neue', Helvetica, Arial, sans-serif";
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
   Focal study utilities
--------------------------------- */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createBlurredCanvas(sourceCanvas, blurAmount) {
  const outputCanvas = createOffscreenCanvas(sourceCanvas.width, sourceCanvas.height);
  const outputCtx = outputCanvas.getContext("2d");

  outputCtx.filter = blurAmount > 0 ? `blur(${blurAmount}px)` : "none";
  outputCtx.drawImage(sourceCanvas, 0, 0);
  outputCtx.filter = "none";

  return outputCanvas;
}

function createFocalStudyCanvas(sourceCanvas, focalPoint, options = {}) {
  if (!sourceCanvas) {
    return null;
  }

  if (!focalPoint) {
    return sourceCanvas;
  }

  const {
    radiusPercent = 18,
    blurAmount = 12,
    dimOpacity = 0.14
  } = options;

  const outputCanvas = createOffscreenCanvas(sourceCanvas.width, sourceCanvas.height);
  const outputCtx = outputCanvas.getContext("2d");
  const blurredCanvas = createBlurredCanvas(sourceCanvas, blurAmount);

  outputCtx.drawImage(blurredCanvas, 0, 0);

  if (dimOpacity > 0) {
    outputCtx.save();
    outputCtx.fillStyle = `rgba(244, 241, 234, ${dimOpacity})`;
    outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
    outputCtx.restore();
  }

  const focusOverlayCanvas = createOffscreenCanvas(sourceCanvas.width, sourceCanvas.height);
  const focusOverlayCtx = focusOverlayCanvas.getContext("2d");
  focusOverlayCtx.drawImage(sourceCanvas, 0, 0);

  const focusRadius = Math.max(
    60,
    Math.round(Math.min(sourceCanvas.width, sourceCanvas.height) * (radiusPercent / 100))
  );
  const innerRadius = Math.max(24, Math.round(focusRadius * 0.55));
  const outerRadius = Math.max(innerRadius + 24, Math.round(focusRadius * 1.45));

  const gradient = focusOverlayCtx.createRadialGradient(
    focalPoint.x,
    focalPoint.y,
    innerRadius,
    focalPoint.x,
    focalPoint.y,
    outerRadius
  );

  gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
  gradient.addColorStop(0.65, "rgba(0, 0, 0, 0.94)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  focusOverlayCtx.globalCompositeOperation = "destination-in";
  focusOverlayCtx.fillStyle = gradient;
  focusOverlayCtx.fillRect(0, 0, focusOverlayCanvas.width, focusOverlayCanvas.height);

  outputCtx.drawImage(focusOverlayCanvas, 0, 0);

  return outputCanvas;
}

function drawFocalMarker(ctx, imageRect, sourceCanvas, focalPoint, radiusPercent) {
  if (!focalPoint || !sourceCanvas || !imageRect) {
    return;
  }

  const scale = Math.min(
    imageRect.width / sourceCanvas.width,
    imageRect.height / sourceCanvas.height
  );
  const centerX = imageRect.x + (focalPoint.x * scale);
  const centerY = imageRect.y + (focalPoint.y * scale);
  const sourceRadius = Math.min(sourceCanvas.width, sourceCanvas.height) * (radiusPercent / 100);
  const displayRadius = Math.max(14, sourceRadius * scale);

  ctx.save();
  ctx.strokeStyle = "rgba(203, 112, 55, 0.95)";
  ctx.fillStyle = "rgba(203, 112, 55, 0.95)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, displayRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(centerX - 10, centerY);
  ctx.lineTo(centerX + 10, centerY);
  ctx.moveTo(centerX, centerY - 10);
  ctx.lineTo(centerX, centerY + 10);
  ctx.stroke();
  ctx.restore();
}

/* ---------------------------------
   App controller
--------------------------------- */

class PaintersReferenceApp {
  constructor() {
    this.dom = {
      imageInput: document.getElementById("imageInput"),
      referenceUploadBlock: document.getElementById("referenceUploadBlock"),
      referenceSummary: document.getElementById("referenceSummary"),
      referenceFileName: document.getElementById("referenceFileName"),
      changeImageButton: document.getElementById("changeImageButton"),
      mainCanvas: document.getElementById("mainCanvas"),
      canvasPlaceholder: document.getElementById("canvasPlaceholder"),
      statusText: document.getElementById("statusText"),
      originalSizeText: document.getElementById("originalSizeText"),
      canvasSizeText: document.getElementById("canvasSizeText"),
      scaleText: document.getElementById("scaleText"),
      viewModeText: document.getElementById("viewModeText"),
      outlineDetailText: document.getElementById("outlineDetailText"),
      outlineControlsSection: document.getElementById("outlineControlsSection"),
      outlinePresetLabel: document.getElementById("outlinePresetLabel"),
      outlineSensitivityInput: document.getElementById("outlineSensitivityInput"),
      outlineSensitivityValue: document.getElementById("outlineSensitivityValue"),
      outlineSmoothingInput: document.getElementById("outlineSmoothingInput"),
      outlineSmoothingValue: document.getElementById("outlineSmoothingValue"),
      outlinePresetButtons: Array.from(document.querySelectorAll("[data-outline-preset]")),
      squintControlsSection: document.getElementById("squintControlsSection"),
      squintBlurInput: document.getElementById("squintBlurInput"),
      squintBlurValue: document.getElementById("squintBlurValue"),
      notanShadowCutoffInput: document.getElementById("notanShadowCutoffInput"),
      notanShadowCutoffValue: document.getElementById("notanShadowCutoffValue"),
      notanLightCutoffInput: document.getElementById("notanLightCutoffInput"),
      notanLightCutoffValue: document.getElementById("notanLightCutoffValue"),
      notanControlsSection: document.getElementById("notanControlsSection"),
      resetNotanButton: document.getElementById("resetNotanButton"),
      focalRadiusInput: document.getElementById("focalRadiusInput"),
      focalRadiusValue: document.getElementById("focalRadiusValue"),
      focalSoftnessInput: document.getElementById("focalSoftnessInput"),
      focalSoftnessValue: document.getElementById("focalSoftnessValue"),
      clearFocalPointButton: document.getElementById("clearFocalPointButton"),
      viewModeButtons: Array.from(document.querySelectorAll("[data-view-mode]")),
      stageSections: Array.from(document.querySelectorAll("[data-stage-section]")),
      stageToggleButtons: Array.from(document.querySelectorAll("[data-stage-toggle]")),
      stageBodyElements: Array.from(document.querySelectorAll("[data-stage-body]")),
      baselineStageValue: document.getElementById("baselineStageValue"),
      compositionStageValue: document.getElementById("compositionStageValue"),
      drawingStageValue: document.getElementById("drawingStageValue"),
      paintingStageValue: document.getElementById("paintingStageValue"),
      generalStageValue: document.getElementById("generalStageValue"),

      showGridInput: document.getElementById("showGridInput"),
      rowsInput: document.getElementById("rowsInput"),
      columnsInput: document.getElementById("columnsInput"),

      exportSheet1Button: document.getElementById("exportSheet1Button"),
      exportSheet2Button: document.getElementById("exportSheet2Button")
    };

    this.ctx = this.dom.mainCanvas.getContext("2d", { alpha: false });

    this.state = {
      originalImage: null,
      originalWidth: 0,
      originalHeight: 0,
      loadedFileName: "",
      workingCanvasWidth: 0,
      workingCanvasHeight: 0,
      workingScale: 1,
      viewMode: "original",
      activeStage: "baseline",
      outline: {
        sensitivity: 60,
        smoothing: 1
      },
      squint: {
        softness: 35
      },
      stageSelections: {
        baseline: "original",
        composition: "focalStudy",
        drawing: "outlineSketch",
        painting: "grayscale"
      },
      notan: {
        shadowCutoff: 85,
        lightCutoff: 170,
        minimumGap: 10
      },
      focalStudy: {
        point: null,
        radiusPercent: 18,
        blurAmount: 12
      },
      processed: {
        originalCanvas: null,
        grayscaleCanvas: null,
        notanCanvas: null,
        lightMaskCanvas: null,
        midtoneMaskCanvas: null,
        shadowMaskCanvas: null,
        outlineSketchCanvas: null,
        squintCanvas: null,
        mirrorCanvas: null
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
    this.focalStudyLayout = null;

    this.bindEvents();
    this.initializeCanvas();
    this.syncControls();
  }

  getStageForViewMode(viewMode) {
    const stageByViewMode = {
      original: "baseline",
      focalStudy: "composition",
      outlineSketch: "drawing",
      squint: "drawing",
      mirror: "drawing",
      grayscale: "painting",
      notan: "painting",
      lightMask: "painting",
      midtoneMask: "painting",
      shadowMask: "painting"
    };

    return stageByViewMode[viewMode] || "baseline";
  }

  setViewMode(nextViewMode) {
    if (!nextViewMode) {
      return;
    }

    this.state.viewMode = nextViewMode;
    this.state.activeStage = this.getStageForViewMode(nextViewMode);
    this.state.stageSelections[this.state.activeStage] = nextViewMode;
    this.updateViewModeLabel();
    this.updateViewModeButtons();
    this.updateStagePanels();
    this.renderScene();
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

    this.dom.outlineSensitivityInput.addEventListener("input", () => {
      this.state.outline.sensitivity = this.getSafeInteger(
        this.dom.outlineSensitivityInput.value,
        60,
        10,
        120
      );
      this.refreshOutlineCanvas();
      this.updateOutlineControls();
      this.renderScene();
    });

    this.dom.outlineSmoothingInput.addEventListener("input", () => {
      this.state.outline.smoothing = this.getSafeInteger(
        this.dom.outlineSmoothingInput.value,
        1,
        0,
        3
      );
      this.refreshOutlineCanvas();
      this.updateOutlineControls();
      this.renderScene();
    });

    this.dom.squintBlurInput.addEventListener("input", () => {
      this.state.squint.softness = this.getSafeInteger(
        this.dom.squintBlurInput.value,
        35,
        0,
        100
      );
      this.refreshSquintCanvas();
      this.updateSquintControls();
      this.renderScene();
    });

    this.dom.notanShadowCutoffInput.addEventListener("input", () => {
      const nextShadowCutoff = this.getSafeInteger(
        this.dom.notanShadowCutoffInput.value,
        85,
        0,
        245
      );
      this.state.notan.shadowCutoff = Math.min(
        nextShadowCutoff,
        this.state.notan.lightCutoff - this.state.notan.minimumGap
      );
      this.refreshNotanCanvas();
      this.updateNotanControls();
      this.renderScene();
    });

    this.dom.notanLightCutoffInput.addEventListener("input", () => {
      const nextLightCutoff = this.getSafeInteger(
        this.dom.notanLightCutoffInput.value,
        170,
        10,
        255
      );
      this.state.notan.lightCutoff = Math.max(
        nextLightCutoff,
        this.state.notan.shadowCutoff + this.state.notan.minimumGap
      );
      this.refreshNotanCanvas();
      this.updateNotanControls();
      this.renderScene();
    });

    this.dom.focalRadiusInput.addEventListener("input", () => {
      this.state.focalStudy.radiusPercent = this.getSafeInteger(
        this.dom.focalRadiusInput.value,
        18,
        10,
        35
      );
      this.updateFocalStudyControls();
      this.renderScene();
    });

    this.dom.focalSoftnessInput.addEventListener("input", () => {
      this.state.focalStudy.blurAmount = this.getSafeInteger(
        this.dom.focalSoftnessInput.value,
        12,
        4,
        24
      );
      this.updateFocalStudyControls();
      this.renderScene();
    });

    this.dom.viewModeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextViewMode = button.dataset.viewMode;
        if (!nextViewMode || nextViewMode === this.state.viewMode) {
          return;
        }

        this.setViewMode(nextViewMode);
      });
    });

    this.dom.outlinePresetButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const presetKey = button.dataset.outlinePreset;
        if (!presetKey) {
          return;
        }

        const preset = getOutlinePresetSettings(presetKey);
        this.state.outline.sensitivity = preset.sensitivity;
        this.state.outline.smoothing = preset.smoothing;
        this.refreshOutlineCanvas();
        this.updateOutlineControls();
        this.renderScene();
      });
    });

    this.dom.stageToggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const stage = button.dataset.stageToggle;
        if (!stage) {
          return;
        }

        if (stage === "general") {
          this.state.activeStage = "general";
          this.updateStagePanels();
          return;
        }

        const nextViewMode = this.state.stageSelections[stage] || "original";
        this.setViewMode(nextViewMode);
      });
    });

    this.dom.exportSheet1Button.addEventListener("click", () => {
      this.exportSheet1();
    });

    this.dom.exportSheet2Button.addEventListener("click", () => {
      this.exportSheet2();
    });

    this.dom.clearFocalPointButton.addEventListener("click", () => {
      this.state.focalStudy.point = null;
      this.updateFocalStudyControls();
      this.updateStatus("Focal point cleared");
      this.renderScene();
    });

    this.dom.resetNotanButton.addEventListener("click", () => {
      this.state.notan.shadowCutoff = 85;
      this.state.notan.lightCutoff = 170;
      this.refreshNotanCanvas();
      this.updateNotanControls();
      this.renderScene();
    });

    this.dom.changeImageButton.addEventListener("click", () => {
      this.dom.imageInput.click();
    });

    this.dom.mainCanvas.addEventListener("click", (event) => {
      this.handleMainCanvasClick(event);
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
    this.updateViewModeLabel();
    this.updateViewModeButtons();
    this.updateStagePanels();
    this.updateOutlineDetailLabel();
    this.updateOutlineControls();
    this.updateSquintControls();
    this.updateNotanControls();
    this.updateFocalStudyControls();
    this.updateReferenceSection();
  }

  updateViewModeLabel() {
    const labels = {
      original: "Original",
      focalStudy: "Focal Study",
      grayscale: "Grayscale",
      notan: "3-Value Notan",
      lightMask: "Light Mask",
      midtoneMask: "Midtone Mask",
      shadowMask: "Shadow Mask",
      outlineSketch: "Rough Outline Sketch",
      squint: "Squint",
      mirror: "Mirror Check"
    };

    this.dom.viewModeText.textContent = labels[this.state.viewMode] || "Original";
  }

  updateOutlineDetailLabel() {
    this.dom.outlineDetailText.textContent = getOutlineDisplayLabel(this.state.outline);
  }

  updateViewModeButtons() {
    this.dom.viewModeButtons.forEach((button) => {
      const isActive = button.dataset.viewMode === this.state.viewMode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  updateStagePanels() {
    this.dom.stageSections.forEach((section) => {
      const isActive = section.dataset.stageSection === this.state.activeStage;
      section.classList.toggle("is-active", isActive);
    });

    this.dom.stageBodyElements.forEach((body) => {
      const isActive = body.dataset.stageBody === this.state.activeStage;
      body.classList.toggle("is-hidden", !isActive);
    });

    this.dom.stageToggleButtons.forEach((button) => {
      const isActive = button.dataset.stageToggle === this.state.activeStage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    const labels = {
      original: "Original",
      focalStudy: "Focal Study",
      outlineSketch: "Rough Outline",
      squint: "Squint",
      mirror: "Mirror Check",
      grayscale: "Grayscale",
      notan: "3-Value Notan",
      lightMask: "Light Mask",
      midtoneMask: "Midtone Mask",
      shadowMask: "Shadow Mask"
    };

    this.dom.baselineStageValue.textContent =
      labels[this.state.stageSelections.baseline] || "Original";
    this.dom.compositionStageValue.textContent =
      labels[this.state.stageSelections.composition] || "Focal Study";
    this.dom.drawingStageValue.textContent =
      this.state.stageSelections.drawing === "outlineSketch"
        ? `Outline (${getOutlineDisplayLabel(this.state.outline)})`
        : (labels[this.state.stageSelections.drawing] || "Rough Outline");
    this.dom.paintingStageValue.textContent =
      labels[this.state.stageSelections.painting] || "Grayscale";
    this.dom.generalStageValue.textContent = "Exports";

    const isNotanActive =
      this.state.activeStage === "painting" && this.state.viewMode === "notan";
    this.dom.notanControlsSection.classList.toggle("is-hidden", !isNotanActive);

    const isOutlineActive =
      this.state.activeStage === "drawing" && this.state.viewMode === "outlineSketch";
    this.dom.outlineControlsSection.classList.toggle("is-hidden", !isOutlineActive);

    const isSquintActive =
      this.state.activeStage === "drawing" && this.state.viewMode === "squint";
    this.dom.squintControlsSection.classList.toggle("is-hidden", !isSquintActive);
  }

  updateOutlineControls() {
    this.dom.outlineSensitivityInput.value = this.state.outline.sensitivity;
    this.dom.outlineSmoothingInput.value = this.state.outline.smoothing;
    this.dom.outlineSensitivityValue.textContent = `${this.state.outline.sensitivity}`;
    this.dom.outlineSmoothingValue.textContent =
      `${this.state.outline.smoothing} ${this.state.outline.smoothing === 1 ? "pass" : "passes"}`;

    const activePresetKey = getMatchingOutlinePresetKey(this.state.outline);
    this.dom.outlinePresetLabel.textContent =
      activePresetKey ? getOutlinePresetSettings(activePresetKey).label : "Custom";

    this.dom.outlinePresetButtons.forEach((button) => {
      const isActive = button.dataset.outlinePreset === activePresetKey;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  updateNotanControls() {
    this.dom.notanShadowCutoffInput.value = this.state.notan.shadowCutoff;
    this.dom.notanLightCutoffInput.value = this.state.notan.lightCutoff;
    this.dom.notanShadowCutoffValue.textContent = `${this.state.notan.shadowCutoff}`;
    this.dom.notanLightCutoffValue.textContent = `${this.state.notan.lightCutoff}`;
  }

  updateSquintControls() {
    this.dom.squintBlurInput.value = this.state.squint.softness;
    this.dom.squintBlurValue.textContent = `${this.state.squint.softness}%`;
  }

  updateFocalStudyControls() {
    this.dom.focalRadiusInput.value = this.state.focalStudy.radiusPercent;
    this.dom.focalRadiusValue.textContent = `${this.state.focalStudy.radiusPercent}%`;
    this.dom.focalSoftnessInput.value = this.state.focalStudy.blurAmount;
    this.dom.focalSoftnessValue.textContent = `${this.state.focalStudy.blurAmount} px`;
    this.dom.clearFocalPointButton.disabled = !this.state.focalStudy.point;
  }

  updateReferenceSection() {
    const hasLoadedImage = Boolean(this.state.loadedFileName);
    this.dom.referenceUploadBlock.classList.toggle("is-hidden", hasLoadedImage);
    this.dom.referenceSummary.classList.toggle("is-hidden", !hasLoadedImage);
    this.dom.referenceFileName.textContent = this.state.loadedFileName || "None";
  }

  refreshNotanCanvas() {
    if (!this.state.processed.grayscaleCanvas) {
      return;
    }

    this.state.processed.notanCanvas = createNotanCanvasFromGrayscaleCanvas(
      this.state.processed.grayscaleCanvas,
      {
        shadowCutoff: this.state.notan.shadowCutoff,
        lightCutoff: this.state.notan.lightCutoff
      }
    );
  }

  refreshOutlineCanvas() {
    if (!this.state.processed.grayscaleCanvas) {
      return;
    }

    this.state.processed.outlineSketchCanvas = createOutlineSketchCanvasFromGrayscaleCanvas(
      this.state.processed.grayscaleCanvas,
      this.state.outline
    );
    this.refreshDrawingDerivedCanvases();
  }

  refreshSquintCanvas() {
    if (!this.state.processed.outlineSketchCanvas) {
      return;
    }

    this.state.processed.squintCanvas = createSquintCanvasFromCanvas(
      this.state.processed.outlineSketchCanvas,
      this.state.squint
    );
  }

  refreshMirrorCanvas() {
    if (!this.state.processed.outlineSketchCanvas) {
      return;
    }

    this.state.processed.mirrorCanvas = createMirroredCanvasFromCanvas(
      this.state.processed.outlineSketchCanvas
    );
  }

  refreshDrawingDerivedCanvases() {
    this.refreshSquintCanvas();
    this.refreshMirrorCanvas();
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
      this.state.loadedFileName = file.name;
      this.state.focalStudy.point = null;

      this.prepareWorkingCanvases();
      this.renderScene();

      this.dom.canvasPlaceholder.classList.add("is-hidden");
      this.updateReferenceSection();
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
    const notanCanvas = createNotanCanvasFromGrayscaleCanvas(grayscaleCanvas, {
      shadowCutoff: this.state.notan.shadowCutoff,
      lightCutoff: this.state.notan.lightCutoff
    });

    const lightMaskCanvas = createTintedMaskCanvasFromGrayscaleCanvas(grayscaleCanvas, "light");
    const midtoneMaskCanvas = createTintedMaskCanvasFromGrayscaleCanvas(grayscaleCanvas, "midtone");
    const shadowMaskCanvas = createTintedMaskCanvasFromGrayscaleCanvas(grayscaleCanvas, "shadow");

    const outlineSketchCanvas =
      createOutlineSketchCanvasFromGrayscaleCanvas(grayscaleCanvas, this.state.outline);
    const squintCanvas = createSquintCanvasFromCanvas(outlineSketchCanvas, this.state.squint);
    const mirrorCanvas = createMirroredCanvasFromCanvas(outlineSketchCanvas);

    this.state.processed.originalCanvas = originalCanvas;
    this.state.processed.grayscaleCanvas = grayscaleCanvas;
    this.state.processed.notanCanvas = notanCanvas;
    this.state.processed.lightMaskCanvas = lightMaskCanvas;
    this.state.processed.midtoneMaskCanvas = midtoneMaskCanvas;
    this.state.processed.shadowMaskCanvas = shadowMaskCanvas;
    this.state.processed.outlineSketchCanvas = outlineSketchCanvas;
    this.state.processed.squintCanvas = squintCanvas;
    this.state.processed.mirrorCanvas = mirrorCanvas;

    this.state.workingCanvasWidth = contained.width;
    this.state.workingCanvasHeight = contained.height;
    this.state.workingScale = contained.scale;
  }

  getActiveOutlineCanvas() {
    return this.state.processed.outlineSketchCanvas;
  }

  getActiveBaseCanvas() {
    const map = {
      original: this.state.processed.originalCanvas,
      grayscale: this.state.processed.grayscaleCanvas,
      notan: this.state.processed.notanCanvas,
      lightMask: this.state.processed.lightMaskCanvas,
      midtoneMask: this.state.processed.midtoneMaskCanvas,
      shadowMask: this.state.processed.shadowMaskCanvas,
      outlineSketch: this.getActiveOutlineCanvas(),
      squint: this.state.processed.squintCanvas,
      mirror: this.state.processed.mirrorCanvas
    };

    return map[this.state.viewMode] || this.state.processed.originalCanvas;
  }

  handleMainCanvasClick(event) {
    if (!this.state.processed.originalCanvas) {
      return;
    }

    const rect = this.dom.mainCanvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const scaleX = this.dom.mainCanvas.width / rect.width;
    const scaleY = this.dom.mainCanvas.height / rect.height;
    const canvasX = (event.clientX - rect.left) * scaleX;
    const canvasY = (event.clientY - rect.top) * scaleY;

    let imageRect = null;

    if (this.state.viewMode === "focalStudy") {
      if (!this.focalStudyLayout || !this.focalStudyLayout.sourceImageRect) {
        return;
      }
      imageRect = this.focalStudyLayout.sourceImageRect;
    } else {
      imageRect = {
        x: 0,
        y: 0,
        width: this.dom.mainCanvas.width,
        height: this.dom.mainCanvas.height
      };
    }

    const isInsideImage =
      canvasX >= imageRect.x &&
      canvasX <= imageRect.x + imageRect.width &&
      canvasY >= imageRect.y &&
      canvasY <= imageRect.y + imageRect.height;

    if (!isInsideImage) {
      return;
    }

    const pointX =
      ((canvasX - imageRect.x) / imageRect.width) * this.state.processed.originalCanvas.width;
    const pointY =
      ((canvasY - imageRect.y) / imageRect.height) * this.state.processed.originalCanvas.height;

    this.state.focalStudy.point = {
      x: clamp(pointX, 0, this.state.processed.originalCanvas.width),
      y: clamp(pointY, 0, this.state.processed.originalCanvas.height)
    };

    if (this.state.viewMode !== "focalStudy") {
      this.state.stageSelections.composition = "focalStudy";
      this.setViewMode("focalStudy");
      this.updateFocalStudyControls();
      this.updateStatus("Focal point selected");
      return;
    }

    this.updateFocalStudyControls();
    this.updateStatus("Focal point selected");
    this.renderScene();
  }

  renderFocalStudyScene() {
    const originalCanvas = this.state.processed.originalCanvas;
    if (!originalCanvas) {
      return;
    }

    const studyCanvas = createFocalStudyCanvas(originalCanvas, this.state.focalStudy.point, {
      radiusPercent: this.state.focalStudy.radiusPercent,
      blurAmount: this.state.focalStudy.blurAmount
    });

    const labelHeight = 62;
    const margin = 24;
    const gutter = 24;
    const panelImageSize = computeContainSize(
      originalCanvas.width,
      originalCanvas.height,
      620,
      620
    );
    const panelWidth = panelImageSize.width;
    const panelHeight = panelImageSize.height + labelHeight;
    const canvasWidth = (margin * 2) + (panelWidth * 2) + gutter;
    const canvasHeight = (margin * 2) + panelHeight;

    setCanvasSize(this.dom.mainCanvas, canvasWidth, canvasHeight);
    clearCanvas(this.ctx, this.dom.mainCanvas);

    const sourcePanelRect = drawPanel(
      this.ctx,
      originalCanvas,
      margin,
      margin,
      panelWidth,
      panelHeight,
      "Original",
      {
        labelHeight,
        sublabel: "Click image to place or move focal point",
        overlayDrawer: (ctx, imageRect) => {
          drawFocalMarker(
            ctx,
            imageRect,
            originalCanvas,
            this.state.focalStudy.point,
            this.state.focalStudy.radiusPercent
          );
        }
      }
    );

    const studyPanelRect = drawPanel(
      this.ctx,
      studyCanvas,
      margin + panelWidth + gutter,
      margin,
      panelWidth,
      panelHeight,
      "Focal Study",
      {
        labelHeight,
        overlayDrawer: (ctx, imageRect) => {
          drawFocalMarker(
            ctx,
            imageRect,
            originalCanvas,
            this.state.focalStudy.point,
            this.state.focalStudy.radiusPercent
          );
        }
      }
    );

    this.focalStudyLayout = {
      sourceImageRect: sourcePanelRect,
      studyImageRect: studyPanelRect
    };

    if (!this.state.focalStudy.point) {
      this.updateStatus("Click the original image to set a focal point");
    } else {
      this.updateStatus("Focal study ready");
    }

    this.updateInfo();
    this.updateViewModeLabel();
    this.updateOutlineDetailLabel();
    this.updateFocalStudyControls();
  }

  renderScene() {
    if (this.state.viewMode === "focalStudy") {
      this.renderFocalStudyScene();
      return;
    }

    this.focalStudyLayout = null;
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
          label: `Outline (${getOutlineDisplayLabel(this.state.outline)})`,
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
