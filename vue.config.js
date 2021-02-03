/**
 * @created by helin3 2019-11-21
 * @updated by chencm 2019-11-25
 * @description vue-cli 配置
 */

const path = require('path');
const resolve = dir => path.join(__dirname, dir);

/* global process, module */
/* eslint no-console: 0 */
const mocksServer = require('./mocks/mocks-server.js');

/**
 * 开发模式，获取代理配置
 * 注: 若配置项VUE_APP_BASE_API包含协议、域名[IP]、端口[可选]，开发模式则默认配置代理
 */
const getProxyConfig = () => {
  const devEnv = process.env.NODE_ENV === 'development'; // 开发环境

  // # 应用服务前缀URL
  // # 1) 指定应用模式，Protocol(http/https)+IP+PORT。如：'https://172.16.20.92:8102/xyapp'
  // #    开发环境：默认开启反向代理，反向代理到：http://localhost:8102/dev-proxy-api/
  // # 2) 本地应用模式，前后端部署在一起。如：'' 或者 '/xyapp'
  const baseApi = ''; // 应用服务前缀URL
  const proxyPrefix = '/dev-proxy-api'; // 代理API前缀
  const match = /^(https?:\/\/[0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?/i; // 匹配URL(协议+域名+端口)
  let matchResult = match.exec(baseApi);

  let devServerProxy = {}; // 配置的代理对象，默认false，为空
  if (devEnv && matchResult) {
    // VUE_APP_BASE_API代理配置演示，/dev-proxy-api/xxx-api/* => https://172.16.20.92:8102/xxx-api/*
    // 详见: https://cli.vuejs.org/config/#devserver-proxy
    devServerProxy[proxyPrefix] = {
      target: `${matchResult[1] + matchResult[2]}`, // 协议+域名
      changeOrigin: true,
      pathRewrite: {
        ['^' + proxyPrefix]: ''
      }
    };
    /** DO-MORE-START: 你可以在此次手动添加更多的代理项配置 */
    // let yourPrefix = '/ebank';//proxyPrefix +
    // let yourHost = 'http://2.0.0.89:7070';//;'http://172.16.20.9102:8080'
    // devServerProxy[yourPrefix] = {
    //   target: `${yourHost}`, // 协议+域名
    //   changeOrigin: true,
    //   pathRewrite: {
    //     ['^' + yourPrefix]: ''
    //   }
    // }
    /** DO-MORE-END */
  }
  devServerProxy = JSON.stringify(devServerProxy) == '{}' ? false : devServerProxy;
  return devServerProxy;
};

module.exports = {
  parallel: false,
  devServer: {
    disableHostCheck: true,
    port: 9102,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    // proxy: getProxyConfig(),
    proxy: {
      '/chdcebankapp': {
        target: 'https://ald.lccb.com.cn:280', // 配置反向代理'http://219.143.38.252:18080/yump-mgw/''http://172.16.20.34:7070'
        changeOrigin: true,
        pathRewrite: {
          '^/chdcebankapp': '/chdcebankapp'
        }
      }
    }
    // https://webpack.js.org/configuration/dev-server/#devserverbefore
    // before: mocksServer
  },
  chainWebpack: config => {
    // set svg-sprite-loader
    if (process.env.UNI_PLATFORM === 'h5' || process.env.UNI_PLATFORM === 'app-fox') {
      config.module
        .rule('svg')
        .exclude.add(resolve('src/assets/icons'))
        .end();
      config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/assets/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
        .end();
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@static': resolve('src/static'),
        '@styles': resolve('src/assets/styles')
      }
    },
    // output: {
    //   // #ifndef MP-WEIXIN
    //   filename: 'static/js/[name].js',
    //   chunkFilename: 'static/js/[name].js',
    //   // #endif
    //   // #ifdef MP-WEIXIN
    //   filename: '[name].js',
    //   chunkFilename: '[name].js',
    //   // #endif
    // },
    externals: {
      'VConsole': 'VConsole'
    }
  }
};
