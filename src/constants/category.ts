import yamlConfig from "../../site.yaml";

// { '随笔': 'life' }
export const categoryMap: { [name: string]: string } = yamlConfig.categoryMap || {};
