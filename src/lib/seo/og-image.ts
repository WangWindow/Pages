import type { ImageMetadata } from "astro";
import { siteConfig } from "@constants/site-config";
import { getCoverUrl } from "@lib/content/transforms";

/**
 * Get the OG image URL with proper fallback chain
 * Priority: cover → defaultOgImage → avatar
 *
 * @param cover - Optional post cover image (ImageMetadata or string path)
 * @param site - Site URL for absolute URL generation
 * @returns Absolute URL string or undefined
 */
export function getOgImageUrl(cover: ImageMetadata | string | undefined, site: URL | undefined): string | undefined {
  const coverUrl = getCoverUrl(cover);
  const imagePath = coverUrl || siteConfig.defaultOgImage || siteConfig.avatar;
  return imagePath && site ? new URL(imagePath, site).href : undefined;
}
