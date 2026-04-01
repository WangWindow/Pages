/**
 * LQIP (Low Quality Image Placeholder) utilities
 *
 * Provides functions to get LQIP gradient backgrounds for images.
 * Now uses a simple color extraction approach at runtime for public images,
 * and fallback gradients for external images.
 */

import sharp from "sharp";
import { join } from "node:path";
import { existsSync } from "node:fs";

// Cache for computed LQIP gradients (in-memory during build)
const lqipCache = new Map<string, string>();

/**
 * Convert RGB to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Generate LQIP gradient from image path at build time
 * Uses sharp to extract dominant colors
 */
async function generateLqipGradient(imagePath: string): Promise<string | undefined> {
  try {
    // Remove leading slash and prepend public directory
    const relativePath = imagePath.replace(/^\//, "");
    const fullPath = join(process.cwd(), "public", relativePath);
    
    if (!existsSync(fullPath)) {
      return undefined;
    }

    // Resize to tiny image and get raw pixel data
    const { data, info } = await sharp(fullPath)
      .resize(3, 3, { fit: "cover" })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Extract 3 colors from the tiny image (corners and center)
    const channels = info.channels;
    const getPixel = (x: number, y: number) => {
      const idx = (y * 3 + x) * channels;
      return rgbToHex(data[idx], data[idx + 1], data[idx + 2]);
    };

    const c1 = getPixel(0, 0); // top-left
    const c2 = getPixel(1, 1); // center
    const c3 = getPixel(2, 2); // bottom-right

    return `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
  } catch (error) {
    console.warn(`Failed to generate LQIP for ${imagePath}:`, error);
    return undefined;
  }
}

/**
 * Get the LQIP gradient CSS for an image (async version)
 * @param imagePath Image path (e.g., /img/cover/1.webp)
 * @returns CSS gradient string or undefined if not found
 */
export async function getLqipGradientAsync(imagePath: string): Promise<string | undefined> {
  // Check cache first
  if (lqipCache.has(imagePath)) {
    return lqipCache.get(imagePath);
  }

  // Generate gradient
  const gradient = await generateLqipGradient(imagePath);
  
  if (gradient) {
    lqipCache.set(imagePath, gradient);
  }
  
  return gradient;
}

/**
 * Get the LQIP gradient CSS for an image (sync version, uses cache only)
 * @param imagePath Image path (e.g., /img/cover/1.webp)
 * @returns CSS gradient string or undefined if not in cache
 */
export function getLqipGradient(imagePath: string): string | undefined {
  return lqipCache.get(imagePath);
}

/**
 * Check if an image path is external (starts with http)
 */
export function isExternalImage(imagePath: string): boolean {
  return imagePath.startsWith("http://") || imagePath.startsWith("https://");
}

/**
 * Get LQIP style for an image (async version)
 * Returns background-image style with gradient
 */
export async function getLqipStyleAsync(imagePath: string): Promise<string | undefined> {
  if (isExternalImage(imagePath)) {
    return undefined;
  }
  const gradient = await getLqipGradientAsync(imagePath);
  return gradient ? `background-image:${gradient}` : undefined;
}

/**
 * Get LQIP style for an image (sync version)
 */
export function getLqipStyle(imagePath: string): string | undefined {
  if (isExternalImage(imagePath)) {
    return undefined;
  }
  const gradient = getLqipGradient(imagePath);
  return gradient ? `background-image:${gradient}` : undefined;
}

/**
 * Get LQIP props for component usage (async version)
 */
export async function getLqipPropsAsync(imagePath: string): Promise<{ style?: string; class?: string }> {
  if (isExternalImage(imagePath)) {
    return { class: "lqip-fallback" };
  }

  const style = await getLqipStyleAsync(imagePath);
  return style ? { style } : {};
}

/**
 * Get LQIP props for component usage (sync version)
 */
export function getLqipProps(imagePath: string): { style?: string; class?: string } {
  if (isExternalImage(imagePath)) {
    return { class: "lqip-fallback" };
  }

  const style = getLqipStyle(imagePath);
  return style ? { style } : {};
}

/**
 * Pre-generate LQIP for a list of image paths (call during build)
 */
export async function preloadLqipCache(imagePaths: string[]): Promise<void> {
  await Promise.all(
    imagePaths
      .filter(path => !isExternalImage(path))
      .map(path => getLqipGradientAsync(path))
  );
}
