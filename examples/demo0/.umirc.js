// ref: https://umijs.org/config/
export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          immer: true,
        },
        dynamicImport: false,
        title: 'demo1',
        dll: false,
        pwa: false,
        routes: {
          exclude: [],
        },
        hardSource: false,
      },
    ],
  ],

  proxy: {
    '/api': {
      target: 'http://192.168.56.101:8069/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
