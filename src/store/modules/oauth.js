import { backend } from '@/config/app.config';

/**
 * @created by anonymous 2019-12-17
 * @updated by
 * @description 会话认证相关模块
 */
/* eslint camelcase: 0 */

const state = () => {
  return {
    accessToken: '', // 访问token
    tokenType: '', // 访问token
    refreshToken: '', // 刷新toekn
    expiresIn: '', // 过期时间
    lastRefreshTime: '', // 上次刷新时间
    userId: null,
    userInfo: {},//用户信息
    forcedLogin: false, // 是否需要强制登录
    hasLogin: false, // 是否登录
    historyUrl: '',//历史路径，登录后跳转回页面
    realNameBack: '',
    loginType: {
      '0': {},//账号
      '1': {},//短信
      '2': {},//刷脸
      '3': {},//指纹
      '4': {},//手势
    }
  }
};

const mutations = {
  setTokens (state, payload) {
    state.accessToken = payload.accessToken;
    state.tokenType = payload.tokenType;
    state.refreshToken = payload.refreshToken;
    state.expiresIn = payload.expiresIn;
    state.lastRefreshTime = payload.lastRefreshTime;
  },

  setSessions (state, payload) {
    let users = { 
      account: payload.account,
      userId: payload.id,
      bankname: payload.bankname,
      headimg: payload.headimg,
      rolename: payload.rolename,
      phone: payload.phone
    };
    state.userId = payload.id;
    state.userInfo = users;
    //固定存储用户信息
    yu.setStorage({
      key: 'userInfo',
      data: users,
      fail: function (error) {
        console.error('用户信息储存异常');
      }
    });
    state.hasLogin = true;
  },

  logout (state) {
    state.accessToken = '';
    state.tokenType = '';
    state.refreshToken = '';
    state.expiresIn = '';
    state.accoList = [];
    // state.userId = null; // userId不能置空, 后面指纹登录和手势登录会用到
    // state.userInfo = {};
    state.hasLogin = false;
  },

  //设置历史访问路径  便于用户登录后跳转
  setHistoryUrl (state, url) {
    state.historyUrl = url;
    yu.setStorage({
      key: 'historyUrl',
      data: { historyUrl: url },
      fail: function (error) {
        console.error('用户信息储存异常');
      }
    });
  },

  //存储用户设定的登录方式
  setLoginType (state, codeObj) {
    state.loginType = codeObj;
    //固定存储登录方式
    yu.setStorage({
      key: 'loginType',
      data: codeObj,
      fail: function (error) {
        console.error('登录方式储存异常');
      }
    });
  }
};

const actions = {

  /**判断登录参数是否正确
  * param: 
  **/
  validLoginParam ({ dispatch, commit }, param) {
    return new Promise(async (resolve, reject) => {
      // 验证登录参数
      resolve();
    });
  },

  // oauth/login
  login ({ dispatch, commit }, reqData = {}) {
    let http = this._vm.$http;
    return new Promise(async (resolve, reject) => {
      //验证请求参数
      //http.request({
      //  method: 'POST',
      //  url: backend.mockExampleService + '/1040',
      //  data: reqData
      //}).then(
      //  (res) => {
      //    console.log('登录成功', res);
      //    if (res.data.code.toString().toLocaleLowerCase() == 'false') {
      //      yu.showToast({
      //        icon: 'none',
      //        title: res.data.message || '登录失败',
      //        duration: 2000
      //      });
      //      return;
      //    }
      //    commit('setTokens', res.data.data || {});
      //    commit('setSessions', res.data.data || {});
      //    // 持久登录-构建本地需要的数据
      //    let storageObj = {};
      //    // 直接存储整个对象
      //    storageObj = Object.assign({}, res.data.data);
      //    storageObj.hasLogin = true;
      //    yu.setStorage({
      //      key: 'loginStatus',
      //      data: storageObj,
      //    })
      //    resolve(res.data.data);
      //  }, // 成功
      //  (err) => {
      //    reject(err);
      //  } // 失败
      //);
      // luch-request 发的请求部分手机自带浏览器请求失败
      uni.request({
        method: 'POST',
        url: 'https://ald.lccb.com.cn:280/yusp-uaa/oauth/token',
        header: { 
          'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
          'Authorization':'Basic d2ViX2FwcDo=',
          'Access-Control-Allow-Origin':'*',
        },
        custom:{oauth:0},
        data: reqData,
        success: (res) => {
          
          
          yu.setStorage({
            key: 'loginStatus',
            data: res.data,
          });
          /* if (res.data.code.toString().toLocaleLowerCase() == 'false') {
            yu.showToast({
              icon: 'none',
              title: res.data.message || '登录失败',
              duration: 2000
            });
            return;
          } */
          //commit('setTokens', res.data || {});
          commit('setSessions', res.data.sysId || {});
          // 持久登录-构建本地需要的数据
          let storageObj = {};
          // 直接存储整个对象
          storageObj = Object.assign({}, res.data);
          storageObj.hasLogin = true;
          // token
          const { access_token,token_type, expires_in, refresh_token } = res.data;
          // 记录 access_token 时间（相对于浏览器客户端来说），默认减去1min中
          const lastRefreshTime = new Date().getTime() - 60000; // 单位：毫秒
          commit('setTokens', {
            accessToken: access_token,
            tokenType: token_type,
            refreshToken: refresh_token,
            expiresIn: expires_in,
            lastRefreshTime: lastRefreshTime
          });
          
          resolve(res.data);
        },
        fail: (err) => {
          yu.showToast({
            icon: "none",
            title: "登录信息错误！",
            duration: 2000
          });
          return;
        }
      });
      // var data = {
      //   smallbankname: '滨海分行',
      //   headimg: 'http://mockplat.dfyusys.com:8890/Image/headImg/abc1b5dc-571c-4870-a56b-6cefef35f4a3.png',
      //   phone: '18876522003',
      //   messagecount: 6,
      //   rolename: '网点管理员',
      //   bankname: '滨海分行',
      //   id: '9527',
      //   type: '0',
      //   account: '6903',
      //   realname: '陈静2',
      //   accessToken: 'xx',
      //   refreshToken: 'xx',
      //   lastRefreshTime: Date.now(),
      // };
      // commit('setTokens', data);
      // commit('setSessions', data);
      // // 持久登录-构建本地需要的数据
      // let storageObj = {};
      // // 直接存储整个对象
      // storageObj = Object.assign({}, data);
      // storageObj.hasLogin = true;
      // yu.setStorage({
      //   key: 'loginStatus',
      //   data: storageObj,
      // })
      // resolve(data);
    })
  },

  // 获取token入口
  getAccessToken ({ dispatch, commit }, reqData) {
    return new Promise((resolve, reject) => {
      let http = this._vm.$http;
      //扩展参数
      let extParam = Object.assign({
      }, reqData);
      http.request({
        url: `${backend.ebankService}/T01001`,
        header: {
          Authorization: 'Basic d2ViX2FwcDo='
        },
        custom: { oauth: 0 },
        data: extParam
      }).then(response => {
        const { access_token,token_type, expires_in, refresh_token } = response.data.data;
        // 记录 access_token 时间（相对于浏览器客户端来说），默认减去1min中
        const lastRefreshTime = new Date().getTime() - 60000; // 单位：毫秒
        commit('setTokens', {
          accessToken: access_token,
          tokenType: token_type,
          refreshToken: refresh_token,
          expiresIn: expires_in,
          lastRefreshTime: lastRefreshTime
        });
        resolve();
      }).catch(response => {
        reject(response);
      });
    });
  },

  // 获取Token请求
  refreshAccessToken ({ state, commit }) {
    return new Promise((resolve, reject) => {
      let http = this._vm.$http;
      http.request({
        url: `${backend.ebankService}/T01001`,
        custom: { oauth: 0 },
        header: {
          Authorization: 'Basic d2ViX2FwcDo='
        },
        data: {
          'grant_type': 'refresh_token',
          'refresh_token': state.refreshToken
        }
      }).then(response => {
        const { access_token,token_type, expires_in, refresh_token } = response.data.data;
        // 记录 access_token 时间（相对于浏览器客户端来说），默认减去1min中
        const lastRefreshTime = new Date().getTime() - 60000; // 单位：毫秒
        commit('setTokens', {
          accessToken: access_token,
          tokenType: token_type,
          refreshToken: refresh_token,
          expiresIn: expires_in,
          lastRefreshTime: lastRefreshTime
        });
        resolve();
      }).catch(response => {
        reject(response);
      });
    });
  },

  // oauth/getSessionInfo 获取用户会话信息
  getSessionInfo ({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      let http = this._vm.$http;
      http.request({
        url: `${backend.ebankService}/T01004`
      }).then(response => {
        let payload = response.data.data || {};
        commit('setSessions', payload);
        resolve();
      }).catch(response => {
        reject(response);
      });
    })
  },

  // oauth/logout 注销
  logout ({ state, commit }) {
    return new Promise((resolve, reject) => {
      let http = this._vm.$http;
      http.request({
        url: `${backend.ebankService}/T01002`,
        data: { token: state.accessToken }
      }).then(response => {
        try {
          uni.report('logout', {
            userId: state.userInfo.usrId,
            time: Date.parse(new Date())
          })
        } catch (e) {
          console.log('yu-stat not enabled.')
        }
        commit('logout');
        resolve();
      }).catch(response => {
        reject(response);
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};