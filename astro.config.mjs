import fs from "node:fs";
import path from "node:path";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import yaml from "@rollup/plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import mermaid from "astro-mermaid";
import pagefind from "astro-pagefind";
import robotsTxt from "astro-robots-txt";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import svgr from "vite-plugin-svgr";
import YAML from "yaml";
import { rehypeImagePlaceholder } from "./src/lib/markdown/rehype-image-placeholder.ts";
import { remarkLinkEmbed } from "./src/lib/markdown/remark-link-embed.ts";

// Load YAML config directly with Node.js (before Vite plugins are available)
// This is only used in astro.config.mjs - other files use @rollup/plugin-yaml
function loadConfigForAstro() {
  const configPath = path.join(process.cwd(), "config", "site.yaml");
  const content = fs.readFileSync(configPath, "utf8");
  return YAML.parse(content);
}

const yamlConfig = loadConfigForAstro();

// Get robots.txt config from YAML
const robotsConfig = yamlConfig.seo?.robots;

// https://astro.build/config
export default defineConfig({
  site: yamlConfig.site.url,
  compressHTML: true,
  markdown: {
    // Enable GitHub Flavored Markdown
    gfm: true,
    // Configure remark plugins for link embedding
    remarkPlugins: [
      [
        remarkLinkEmbed,
        {
          enableTweetEmbed: yamlConfig.content?.enableTweetEmbed ?? true,
          enableOGPreview: yamlConfig.content?.enableOGPreview ?? true,
        },
      ],
    ],
    // Configure rehype plugins for automatic heading IDs and anchor links
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["anchor-link"],
            ariaLabel: "Link to this section",
          },
        },
      ],
      rehypeImagePlaceholder,
    ],
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid"],
    },
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
  integrations: [
    react(),
    sitemap(),
    icon({
      include: {
        gg: ["*"],
        "fa6-regular": ["*"],
        "fa6-solid": ["*"],
        ri: ["*"],
      },
    }),
    pagefind(),
    mermaid({
      autoTheme: true,
    }),
    robotsTxt(robotsConfig || {}),
  ],
  vite: {
    plugins: [yaml(), svgr(), tailwindcss()],
    ssr: {
      noExternal: ["react-tweet"],
    },
    optimizeDeps: {
      include: ["@antv/infographic"],
    },
  },
  trailingSlash: "ignore",
});
