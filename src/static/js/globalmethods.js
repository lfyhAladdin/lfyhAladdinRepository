/**
 * @created by anonymous 2020-11-19
 * @updated by
 * @description 全局公用方法封装（页面跳转，接口请求，字典查询）
 */
import { appEnv } from '@/config/app.config';
import lrz from './lrz.all.bundle.js'
let baseurl = appEnv.host;

export default {
  install(Vue) {
    /**
     * 页面跳转
     * 两种情况：1：路径带参数，2：路径不带参数
     */
    Vue.prototype.pageJump = function (posturl) {
      posturl = '/pages/ebank/' + posturl;
      //判断是否登录
      let hasLogin = true;
      if (!hasLogin) {
        yu.showToast({
          icon: 'none',
          title: '您还未登录，请先登录！',
          duration: 1500
        });
        setTimeout(() => {
          uni.navigateTo({ url: '/pages/ebank/login/login' });
        }, 1500);
      } else {
        uni.navigateTo({ url: posturl });
      }
    };

    /**
     * 接口请求
     * 参数：接口名，参数，请求类型（get/post），成功方法，失败方法
     */
    Vue.prototype.interfaceRequest = function (url, data, method, success, error) {
      this.$http.request({
        url: baseurl + url,
        header: {
          'Content-Type': 'application/json;charset=UTF-8',
          'custom-header': 'aldapp',
          'Access-Control-Allow-Origin': '*'
        },
        custom: { oauth: 1 },
        method: method,
        changeOrigin: true,
        data: data,
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", datatoken);
        },
      }).then(
        res => {
          success(res);
        },
        err => {
          error(err)
        }
      )
    };

    /**
     * 数据字典查询
     * 三种情况：1：只传一个参数，2：传列表值的参数，3：传列表集合参数
     * 参数例子
     * paramone={"dictionaryName":"businessType"}
     * paramtwo={"dictionaryName":"businessType","key":"1140010"}
     * paramthree=[{ "dictionaryName": "businessType", "key": "1140010"},{"dictionaryName": "certType", "key": "Ind01"}] 
     */
    Vue.prototype.queryDictionaryList = function (paramone, success) {
      this.$http.request({
        url: appEnv.host + '/api/dictionary/queryDictionaryList',
        header: {
          'Content-Type': 'application/json;charset=UTF-8',
          'custom-header': 'demo',
          'Access-Control-Allow-Origin': '*'
        },
        method: 'get',
        custom: { oauth: 1 },
        changeOrigin: true,
        data: paramone
      }).then(
        res => {
          success(res);
        },
        err => {
          console.log('失败');
        }
      )
    };
    Vue.prototype.queryDictionaryValue = function (paramtwo, success) {
      this.$http.request({
        url: appEnv.host + '/api/dictionary/queryDictionaryValue',
        header: {
          'Content-Type': 'application/json;charset=UTF-8',
          'custom-header': 'demo',
          'Access-Control-Allow-Origin': '*'
        },
        method: 'get',
        custom: { oauth: 1 },
        changeOrigin: true,
        data: paramtwo
      }).then(
        res => {
          success(res);
        },
        err => {
          console.log('失败');
        }
      )
    };
    Vue.prototype.queryDictionaryListValue = function (paramthree, success) {
      this.$http.request({
        url: appEnv.host + '/api/dictionary/queryDictionaryListValue',
        header: {
          'Content-Type': 'application/json;charset=UTF-8',
          'custom-header': 'demo',
          'Access-Control-Allow-Origin': '*'
        },
        method: 'get',
        custom: { oauth: 1 },
        changeOrigin: true,
        data: paramthree
      }).then(
        res => {
          success(res);
        },
        err => {
          console.log('失败');
        }
      )
    };
    Vue.prototype.loginRelatedPostUrl = "https://ald.lccb.com.cn:280/chdcinner/";
    Vue.prototype.loginPostUrl = "https://ald.lccb.com.cn:280/yusp-uaa/";

    Vue.prototype.compressImages = function (file, type, callback) {
      let base64code = '';
      let quality = 0.1;//压缩比例
      //判断图片大小，改变压缩比例质量start
      if (type == 1) { //路径
        let canvas = document.createElement('canvas'); //.setAttribute('id','canvas');
        let ctx = null;
        var img = new Image();
        img.onload = function () {
          //图片原始宽高
          //console.log(img.constructor)//ƒ HTMLImageElement() { [native code] }
          let w = img.width;
          let h = img.height;
          //将图片的绝对宽高绘制在canvas上
          canvas.width = w;
          canvas.height = h;
          ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(function (res) {
            console.log(res.size); //图片真实存储大小
            let imgsize = (res.size / 1024) / 1024;
            console.log(imgsize);
            getresult(imgsize);
            //console.log(res.type);
          }, 'image/jpeg', 1);
          let base64 = canvas.toDataURL('image/jpeg', 1); //data:image/jpeg;base64,/9j/4AAQSkZJ
          //console.log(base64.length); //不代表图片的存储大小

          var arr = base64.split(','); //['data:image/jpeg;base64',',/9j/4AAQSkZJ']
          var mime = arr[0].match(/:(.*?);/)[1]; //image/jpeg
          var decodeBase64 = atob(arr[1]); //解码使用 base-64 编码的字符串 atob(',/9j/4AAQSkZJ')
          var len = decodeBase64.length;
          var u8arr = new Uint8Array(len);
          while (len--) {
            u8arr[len] = decodeBase64.charCodeAt(len);
          }
          let blob = new Blob([u8arr], {
            type: mime
          });
          //图片真实存储大小
			    console.log((blob.size / 1024)); //kb
          console.log(blob.constructor) //ƒ Blob() { [native code] }
          //console.log(blob.type); //image/jpeg
          //图片真实存储大小
          //let imgsize = (realsize / 1024) / 1024;
          //console.log(imgsize);
          
        }
        img.src = file;
      } else { //file
        let size1 = file.size / 1024;
        let size2 = size1 / 1024;
        getresult(size2);
      }
      //判断图片大小，改变压缩比例质量end
      var getresult = function (imgsize){
        if (imgsize >= 0 && imgsize <= 0.29999999) {
          quality = 0.6;
        } else if (imgsize >= 0.3 && imgsize <= 0.59999999) {
          quality = 0.5;
        } else if (imgsize >= 0.6 && imgsize <= 0.99999999) {
          quality = 0.4;
        } else if (imgsize >= 1 && imgsize <= 2.99999999) {
          quality = 0.2;
        } else {
          quality = 0.1;
        }
        console.log(quality);
        lrz(file, {
          quality: quality
        })
          .then(function (rst) {
            base64code = rst.base64.split(';base64,')[1];
            callback(base64code);
          })
          .catch(function (err) {
            // 处理失败会执行
          })
          .always(function () {
            // 不管是成功失败，都会执行
          });
      }
    }

  }


};

