const app = getApp();
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//扩展日期格式化(yyyy-MM-dd hh:mm:ss)
function format(date, format) {
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
}

//返回送达时间数组
function sendTimeArr() {
  var date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();
  console.log(hour + ":" + minute);

  console.log("app.globalData.timeFrom");
  console.log(app.globalData.timeFrom);
  console.log("app.globalData.timeTo");
  console.log(app.globalData.timeTo);
  var timeFrom = app.globalData.timeFrom.split("-"),
    timeTo = app.globalData.timeTo.split("-");
  var sendTimeArr = [];
  for (var j = 0; j < timeTo.length; j++) {
    var hour1 = parseInt(timeFrom[j].split(":")[0]);
    var hour2 = parseInt(timeTo[j].split(":")[0]);
    if(hour < hour2) {
      while (hour1 <= hour2) {
        var timeArr = ['00', '15', '30', '45'];
        if (hour1 == parseInt(timeFrom[j].split(":")[0])) {
          if (!isInTime()) {
            timeArr = ['30', '45'];
          }
        }
        for (var i = 0; i < timeArr.length; i++) {
          var time = timeFormat(hour1, timeArr[i]);
          sendTimeArr.push(time);
        }
        ++hour1;
      }
    }
  }
  if (!isInTime()) {
    return sendTimeArr;
  }
  console.log(sendTimeArr);
  var index = sendTimeArrIndex(sendTimeArr, hour, minute);
  sendTimeArr = sendTimeArr.slice(index + 2);
  for (var i = 0; i < timeFrom.length; i++) {
    var hour1 = parseInt(timeFrom[i].split(":")[0])
    if (hour < hour1) {
      var timeTmp = [hour1 + ":00", hour1 + ":15"];
      for(var j = 0; j < timeTmp.length; j++) {
        var indexTmp = sendTimeArr.indexOf(timeTmp[j]);
        sendTimeArr.splice(indexTmp, 1);
      }
    }
  }
  if (minute != 0 && minute != 15 && minute != 30 && minute != 45) {
    minute += 30;
    if(minute >= 60) {
      minute -= 60;
      hour += 1;
    }
    sendTimeArr.unshift(timeFormat(hour, minute));
  }
  return sendTimeArr;
}
function sendTimeArrIndex(arr, hour, minute) {
  var index = 0;
  for(var i = 0; i < arr.length; i++) {
    var hourTmp = arr[i].split(":")[0],
      minuteTmp = arr[i].split(":")[1];
    if (hour < hourTmp || (hour == hourTmp && minute <= minuteTmp)) {
      return index = i;
    }
  }
  return index;
}
//如3点2分返回03:02
function timeFormat(hour, minute) {
  var time = "";
  hour = hour + "";
  minute = minute + ""
  if (hour.length == 1) {
    time += "0" + hour;
  } else {
    time += hour;
  }
  time += ":";
  if (minute.length == 1) {
    time += "0" + minute;
  } else {
    time += minute;
  }
  return time;
}
//是否在营业时间内
function isInTime() {
  var date = new Date(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      timeFrom = app.globalData.timeFrom.split("-"),
      timeTo = app.globalData.timeTo.split("-"),
      isInTime = false;
  for (var i = 0; i < timeFrom.length; i++) {
    if (isInTime) {
      return true;
    }
    var hourFrom = timeFrom[i].split(":")[0],
      minuteFrom = timeFrom[i].split(":")[1],
      hourTo = timeTo[i].split(":")[0],
      minuteTo = timeTo[i].split(":")[1];
    if (hour < hourFrom || hour > hourTo || (hour == hourFrom && minute < minuteFrom) || (hour == hourTo && minute > minuteTo)) {
      console.log(hour < hourFrom);
      console.log(hour > hourTo);
      console.log(hour == hourFrom && minute < minuteFrom);
      console.log(hour == hourTo && minute > minuteTo);
      isInTime = false;
    } else {
      isInTime = true;
    }
  }
  console.log(isInTime);
  return isInTime;
}

function isAfterTime() {
  var date = new Date(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    timeTo = app.globalData.timeTo.split("-"),
    isAfterTime = false,
    lastTimeToHour = parseInt(timeTo[timeTo.length - 1].split(":")[0]),
    lastTimeToMinute = parseInt(timeTo[timeTo.length - 1].split(":")[1]);
  if (hour > lastTimeToHour || (hour == lastTimeToHour && minute > lastTimeToMinute)) {
    isAfterTime = true;
  }
  console.log(isAfterTime);
  return isAfterTime;
}
//显示营业时间： 如： 营业时间：09：00-14：00、17：00-19：00
function showBusinessTime () {
  var timeFrom = app.globalData.timeFrom.split("-"),
    timeTo = app.globalData.timeTo.split("-"),
    str = "营业时间：";
  for(var i = 0; i < timeFrom.length; i++) {
    str += timeFrom[i] + "-" + timeTo[i] + "、";
  }
  str = str.slice(0, str.length-1);
  return str;
}
module.exports = {
  formatTime: formatTime,
  sendTimeArr: sendTimeArr,
  format: format,
  isInTime: isInTime,
  isAfterTime: isAfterTime,
  showBusinessTime: showBusinessTime
}
