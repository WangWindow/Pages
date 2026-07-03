import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { parseDateInSiteTimezone, reinterpretUtcAsTimezone } from "@/lib/date";

/**
 * Custom date schema that parses date strings in the site's configured timezone.
 * This ensures consistent date handling regardless of build environment.
 *
 * Accepts:
 * - Date objects (reinterpreted from UTC to site timezone, since gray-matter
 *   incorrectly parses "2025-12-29 21:55:00" as UTC)
 * - Date strings like "2025-12-29 21:55:00" (parsed as site timezone)
 * - ISO strings like "2025-12-29T21:55:00+08:00" (parsed correctly with offset)
 */
const dateInSiteTimezone = z
  .string()
  .or(z.date())
  .transform((val) => {
    if (val instanceof Date) {
      // gray-matter has already parsed the date string as UTC, but user intended site timezone.
      // Reinterpret the UTC values as site timezone to get correct timestamp.
      return reinterpretUtcAsTimezone(val);
    }
    return parseDateInSiteTimezone(val);
  });

const blogCollection = defineCollection({
  // Only load posts under year directories like posts/2025/*/index.md.
  // This intentionally excludes legacy paths such as posts/weekly/*.
  loader: glob({ pattern: "[0-9][0-9][0-9][0-9]/**/*.md", base: "./src/content/blog/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      link: z.string().optional(),
      date: dateInSiteTimezone,
      updated: dateInSiteTimezone.optional(),
      // 支持相对路径图片（使用 image()）或 URL 字符串
      cover: image().or(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      // 兼容老 Hexo 博客
      subtitle: z.string().optional(),
      catalog: z.boolean().optional().default(true),
      categories: z
        .array(z.string())
        .or(z.array(z.array(z.string())))
        .optional(),
      sticky: z.boolean().optional(),
      draft: z.boolean().optional(),
      // 目录编号控制
      tocNumbering: z.boolean().optional().default(true),
      // 排除 AI 摘要生成
      excludeFromSummary: z.boolean().optional(),
      // AI 摘要（从元数据读取）
      summary: z.string().optional(),
    }),
});

export const collections = {
  blog: blogCollection,
};
