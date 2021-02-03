/**
 * @created by anonymous 2019-12-08
 * @updated by
 * @description APP全局参数配置
 * 1. appEnv 参数配置
 * 2. backend 后台API服务映射表
 * TODO: 相比.env.xxx配置缺点，开发者提交后可能会覆盖服务器上的配置，后续权衡如何优化
 */

/**
 * app 环境参数配置
 */
export const appEnv = {
  appName: 'chdcebankApp-zhsm', // 应用名称
  appRunType: 'app', // app | h5
  // #ifdef H5 || MP
  apiVersion: '1.0.0', // api版本
  // #endif
  host: '', // 请求服务主机地址
  appVerUrl: '', // 版本更新服务器地址
  appAssetsUrl: '', // 资源服务器地址(eg:广告)
  devMode: 'dev', // MOCK 外网挡板数据/ LOCAL 本地挡板数据/SIT/UAT/PRO
  touristMode: false, // 开放式,H5模式可以直接进入应用业务页面
  pageNum: '' // 打开业务页面数量，根据测试情况配置
};

// 根据不同的开发环境，配置不同的主机及静态资源
switch (appEnv.devMode) {
  case 'PRO':
    appEnv.host = 'http://219.143.38.252:18080/yump-mgw/10000004';// PRO测试环境
    appEnv.assetsUrl = 'http://219.143.38.252:18080/yump-file';// WEB服务器静态资源路径
    break;
  case 'UAT':
    appEnv.host = 'https://60.10.20.25:280/chdcebankapp'; // UAT测试环境 host  h5模式启动
    appEnv.assetsUrl = 'http://219.143.38.252:18080/yump-file/';//'http://your.github.io/assets/'; // WEB服务器静态资源路径
    break;
  case 'SIT':
    appEnv.host = 'http://your.github.io/app/'; // SIT测试环境 host
    appEnv.assetsUrl = 'http://your.github.io/assets/'; // WEB服务器静态资源路径
    break;
  case 'MOCK':
    appEnv.host = 'https://ald.lccb.com.cn:280/chdcebankapp'; // 外网mock挡板测试环境
    appEnv.assetsUrl = 'http://localhost:9102/assets/'; // WEB服务器静态资源路径
    break;
  default:
    appEnv.host = 'https://ald.lccb.com.cn:280/chdcebankapp';//http://114.255.138.160:18080/yump-mgw/10000002  http://2.0.0.4:8080/10000004本地挡板测试环境http://172.16.20.34:7070 http://219.143.38.252:18080/yump-mgw/10000004 http://192.168.251.163:18080/yump-mgw/10000004
    appEnv.assetsUrl = 'http://114.255.138.160:18080/yump-file/'; // WEB服务器静态资源路径,'http://219.143.38.252:18080/yump-file/';'http://172.16.20.31/'
    break;
};

/**
 * 全局后台API服务映射表
 */
export const backend = {
  // mockExampleService: '/mock-example', // 通用Mock模拟示例服务,
  mockExampleService: 'http://116.62.47.30:9105/mock-example', // 通用Mock模拟示例服务,
  uaaService: '/uaa', // 用户认证微服务
  gatewayService: '/zuul', // 网关
  appCommonService: '/yusp-app-common', // 基础服务
  appOcaService: '/yusp-app-oca',// 组织机构、菜单权限微服务
  ebankService: '',//'/ebank',服务名
  assetsService: '',
  ebankServiceYx: 'http://mockplat.dfyusys.com:8079/yump-mgw/10000004/marketing/', //测试环境 网关地址
  ebankUploadText: '/home/sspusr/UploadFile/', //测试环境上传接口text 参数前缀
  ebankServiceYxImage: 'http://mockplat.dfyusys.com:8890', //测试环境 营销上传影像配置,
};
// 根据不同的开发环境，配置不同的主机及静态资源
switch (appEnv.devMode) {
  case 'PRO':
    backend.ebankServiceYx = 'http://mockplat.dfyusys.com:8079/yump-mgw/10000004/marketing/';//正式环境 网关地址
    backend.ebankUploadText = '/home/sspusr/UploadFile/';//生产环境 上传接口text 参数前缀
    backend.ebankServiceYxImage ='http://mockplat.dfyusys.com:8890';//生产环境 营销上传影像配置,
    break;
  case 'SIT':
    backend.ebankServiceYx = 'http://mockplat.dfyusys.com:8079/yump-mgw/10000004/marketing/';//测试环境 网关地址
    backend.ebankUploadText = '/home/sspusr/UploadFile/';//测试环境上传接口text 参数前缀
    backend.ebankServiceYxImage = 'http://mockplat.dfyusys.com:8890';//测试环境 营销上传影像配置,
    break;
  default:
    break;
};