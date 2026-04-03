import { config, fields, collection, type Collection } from "@keystatic/core";

const isProd = import.meta.env.PROD;

// [AUTO-GENERATED] Years with blog posts - updated by GitHub Action on Jan 1
// To add a new year manually: add it to the beginning of the array
const BLOG_YEARS = ["2026", "2025"] as const;

const postSchema = {
  title: fields.slug({
    name: { label: "标题", validation: { isRequired: true } },
  }),
  date: fields.datetime({
    label: "发布日期",
    validation: { isRequired: true },
  }),
  description: fields.text({
    label: "描述",
    multiline: false,
  }),
  cover: fields.image({
    label: "封面图片",
    directory: ".",
    publicPath: "./",
  }),
  categories: fields.array(fields.text({ label: "分类" }), {
    label: "分类",
    itemLabel: (props) => props.value || "新分类",
  }),
  tags: fields.array(fields.text({ label: "标签" }), {
    label: "标签",
    itemLabel: (props) => props.value || "新标签",
  }),
  draft: fields.checkbox({
    label: "草稿",
    defaultValue: false,
  }),
  sticky: fields.checkbox({
    label: "置顶",
    defaultValue: false,
  }),
  summary: fields.text({
    label: "摘要",
    multiline: true,
    description: "AI 生成或手动编写的文章摘要",
  }),
  content: fields.markdoc({
    label: "正文",
    extension: "md",
  }),
};

function createYearCollection(year: string): Collection<typeof postSchema, "title"> {
  return collection({
    label: `${year} 年文章`,
    slugField: "title",
    path: `src/content/blog/posts/${year}/*/`,
    format: { contentField: "content" },
    entryLayout: "content",
    schema: postSchema,
  });
}

const yearCollections: Record<string, Collection<typeof postSchema, "title">> = {};
for (const year of BLOG_YEARS) {
  yearCollections[`posts-${year}`] = createYearCollection(year);
}

export default config({
  storage: isProd
    ? {
        kind: "github",
        repo: "WangWindow/Blogs",
        branchPrefix: "cms/",
      }
    : { kind: "local" },

  ui: {
    brand: {
      name: "WangWindow's Blog",
    },
    navigation: {
      文章: Object.keys(yearCollections),
      周刊: ["weekly"],
    },
  },

  collections: {
    ...yearCollections,

    weekly: collection({
      label: "周刊",
      slugField: "title",
      path: "src/content/blog/posts/weekly/*/",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({
          name: { label: "标题", validation: { isRequired: true } },
        }),
        date: fields.datetime({
          label: "发布日期",
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: "描述",
          multiline: false,
        }),
        cover: fields.image({
          label: "封面图片",
          directory: ".",
          publicPath: "./",
        }),
        categories: fields.array(fields.text({ label: "分类" }), {
          label: "分类",
          itemLabel: (props) => props.value || "新分类",
        }),
        tags: fields.array(fields.text({ label: "标签" }), {
          label: "标签",
          itemLabel: (props) => props.value || "新标签",
        }),
        draft: fields.checkbox({
          label: "草稿",
          defaultValue: false,
        }),
        summary: fields.text({
          label: "摘要",
          multiline: true,
        }),
        content: fields.mdx({
          label: "正文",
          extension: "md",
        }),
      },
    }),
  },
});
