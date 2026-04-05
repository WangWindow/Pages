/**
 * Sveltia CMS Configuration
 * 使用 JavaScript 配置以获得更好的可维护性和类型提示
 */

// ============================================================================
// 可复用的字段定义
// ============================================================================
const postFields = [
  {
    label: "Slug",
    name: "slug",
    widget: "string",
    required: true,
    pattern: ["^[a-z0-9]+(?:-[a-z0-9]+)*$", "只能使用小写字母、数字和连字符"],
    hint: "文章的 URL 路径名，如 my-first-post",
  },
  {
    label: "标题",
    name: "title",
    widget: "string",
    required: true,
  },
  {
    label: "发布日期",
    name: "date",
    widget: "datetime",
    required: true,
    date_format: "YYYY-MM-DD",
    time_format: "HH:mm:ssZ",
    format: "YYYY-MM-DDTHH:mm:ssZ",
  },
  {
    label: "描述",
    name: "description",
    widget: "text",
    required: false,
    hint: "文章简短描述，用于 SEO 和列表展示",
  },
  {
    label: "封面图片",
    name: "cover",
    widget: "image",
    required: false,
    media_folder: "",
    public_folder: "./",
  },
  {
    label: "分类",
    name: "categories",
    widget: "list",
    required: false,
  },
  {
    label: "标签",
    name: "tags",
    widget: "list",
    required: false,
  },
  {
    label: "草稿",
    name: "draft",
    widget: "boolean",
    default: false,
    required: false,
  },
  {
    label: "置顶",
    name: "sticky",
    widget: "boolean",
    default: false,
    required: false,
  },
  {
    label: "正文",
    name: "body",
    widget: "markdown",
  },
];

/**
 * 创建年份文章集合
 * @param {number} year - 年份
 * @returns {object} 集合配置
 */
function createYearCollection(year) {
  return {
    name: `posts-${year}`,
    label: `${year} 年文章`,
    icon: "article", // Material Icons: https://fonts.google.com/icons
    folder: `posts/${year}`,
    path: "{{fields.slug}}/index",
    media_folder: "",
    public_folder: "./",
    create: true,
    slug: "{{fields.slug}}",
    identifier_field: "slug",
    extension: "md",
    format: "frontmatter",
    sortable_fields: ["date", "title"],
    // 优化的 summary 显示：日期 ┃ 标题 ┃ 分类 ┃ 标签
    summary: "{{date | date('YYYY-MM-DD')}} ┃ {{title}} ┃ {{categories}} ┃ {{tags}}",
    summary_fields: ["date", "title", "categories", "tags", "draft"],
    view_filters: [
      { label: "📝 草稿", field: "draft", pattern: true },
      { label: "✅ 已发布", field: "draft", pattern: false },
    ],
    view_groups: [
      { label: "分类", field: "categories" },
      { label: "标签", field: "tags" },
    ],
    fields: postFields,
  };
}

// ============================================================================
// 主配置
// ============================================================================
const config = {
  load_config_file: false,

  backend: {
    name: "github",
    repo: "WangWindow/Blogs",
    branch: "cms/sveltia",
    base_url: "https://wangwindow.pages.dev",
  },

  media_folder: "uploads",
  public_folder: "/uploads",

  collections: [
    createYearCollection(2026),
    createYearCollection(2025),
    { divider: true },
  ],
};

export default config;
