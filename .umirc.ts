import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: 'ZStack VDI',
  favicon: '/assets/favicon.ico',
  locale: {
    default: 'zh-CN'
  },
  proxy: {
    '/zstack/v1': {
      'target': 'http://localhost:8080', // MN 地址
      'changeOrigin': true,
    },
  },
  fastRefresh: {},
});
