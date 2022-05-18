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
      'target': 'http://172.20.12.207:8080',
      'changeOrigin': true,
    },
  },
  fastRefresh: {},
});
