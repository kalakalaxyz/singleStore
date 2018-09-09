export default {
  methods: {
    jump (to) {
      if (this.$router) {
        this.$router.push(to)
      }
    },
    const(){
    	var data={};
        data.IP= "http://127.0.0.1:80/";
        // data.IP= "https://www.meizizi.store:443/";
    	data.IMAGE_URL = data.IP+"/public/img";
        data.BGCOLOR = "#d95235";
    	return data;
    },
    request(url,options){
        var self = this,
        mySuccess,
        myFail,
        defaults={
            method : 'GET',
            responseType : 'json',
            headers : {'Content-Type':'application/json'},
            data : '',
            // withcredentials: true,
            timeout : 3000
        };
        if( typeof options == "function" ){
            mySuccess = options
        }else{
            for( var key in options ){
                if(key == 'success'){
                    mySuccess = options['success'];
                }else if( key == 'fail' ){
                    myFail = options['fail'];
                }else{
                    defaults[key] = options[key];
                    var token = localStorage.getItem("token");
                    if(token) {
                        defaults.headers.Authorization = token;
                    }
                }
            }
        };
        defaults.url =self.const().IP + url;
        self.$http(defaults)
        .then(function (res) {
            if( mySuccess ){
                typeof mySuccess == 'function' && mySuccess(res);
            };
        })
        .catch(function (error) {
            if( myFail ){
                typeof myFail == 'function' && myFail(res)
            }else{
                console.log("请求捕捉到的错误");
                console.log(error);
                for(var key in error) {
                    console.log(key);
                    console.log(error[key]);
                }
                if(error.response.status == 401 && error.response.statusText == "Unauthorized") {
                    self.$message("登录过期请重新登录");
                    setTimeout(self.jump("/login"),2000);
                } else {
                    console.log(error.response);
                }
            }
        });
    },
    encrypt(data) {
        const CryptoJS = require('crypto-js'); //引用AES源码js 
        const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");
        const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');
        let srcs = CryptoJS.enc.Utf8.parse(data); 
        let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }); 
        return encrypted.ciphertext.toString().toUpperCase();
    },
    imgUpload(e, cb) {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        var isJPG = files[0].type === 'image/jpeg' || 'image/jpg' || 'image/png',
            isLt1M = files[0].size / 1024 / 1024 < 1;
        if(!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 或 JPEG 或 PNG 格式!');
            return;
        }
        if (!isLt1M) {
            this.$message.error('上传头像图片大小不能超过 1MB!');
            return;
        }
        var Form = new FormData();
        Form.append("photo", files[0]);
        this.request("api/image/upload",{
            "method":"POST",
            "data": Form,
            "headers": {"Content-Type": "multipart/form-data"},
            "success": function(res){
                console.log("imageUpload res");
                console.log(res);
                typeof cb == "function" && cb(res);
            }
        });
    },
    //扩展日期格式化(yyyy-MM-dd hh:mm:ss)
    format(date, format) {
        var opt = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds()
        };

        if (new RegExp(/(y+)/).test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        };

        for (var key in opt) {
            if (new RegExp("(" + key + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? opt[key] : ("00" + opt[key]).substr(("" + opt[key]).length));
            }
        };
        return format;
    },
    isEmptyObject: function(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }
  }
}
