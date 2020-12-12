import tinycolor from 'tinycolor2';

let canvas: HTMLCanvasElement | null = null;
const cache: Record<string, TextMetrics> = {};

function getCanvasContext() {
  if (canvas === null) {
    canvas = document.createElement('canvas');
  }

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not create context');
  }

  return context;
}

/**
 * @beta
 */
export function measureText(text: string, fontSize: number): TextMetrics {
  const fontStyle = `${fontSize}px 'Roboto'`;
  const cacheKey = text + fontStyle;
  const fromCache = cache[cacheKey];

  if (fromCache) {
    return fromCache;
  }

  const context = getCanvasContext();

  context.font = fontStyle;
  const metrics = context.measureText(text);

  cache[cacheKey] = metrics;
  return metrics;
}

/**
 * @beta
 */
export function calculateFontSize(text: string, width: number, height: number, lineHeight: number, maxSize?: number) {
  // calculate width in 14px
  const textSize = measureText(text, 14);
  // how much bigger than 14px can we make it while staying within our width constraints
  const fontSizeBasedOnWidth = (width / (textSize.width + 2)) * 14;
  const fontSizeBasedOnHeight = height / lineHeight;

  // final fontSize
  const optimalSize = Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth);
  return Math.min(optimalSize, maxSize ?? optimalSize);
}

/**
 * @beta
 */
export function getCanvasGradient(color: string, amount: number, plotHeight: number): CanvasGradient {
  const ctx = getCanvasContext();
  var gradient = ctx.createLinearGradient(0, 0, 0, plotHeight);
  gradient.addColorStop(
    0,
    tinycolor(color)
      .setAlpha(amount)
      .toRgbString()
  );
  gradient.addColorStop(
    1,
    tinycolor(color)
      .setAlpha(0)
      .toRgbString()
  );
  return gradient;
}
