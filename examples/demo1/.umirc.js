//import odoorc from './.odoorc'

// ref: https://umijs.org/config/

//const { server } = odoorc

//console.log(server)

export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'demo1',
      dll: false,
      pwa: false,
      routes: {
        exclude: [],
      },
      hardSource: false,
    }],
  ],

  "proxy": {
    "/api": {
      "target": '',
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  }

}
