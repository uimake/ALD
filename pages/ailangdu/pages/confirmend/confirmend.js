// pages/confirmend/confirmend.js
let innerAudioContext = null;
const app = getApp();
let timerOut = null;
var flg = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    duration: 0,
    currentTime: 0,
    lastTime: 0,
    percent: 0,
    tabTitle: '',
    text: [],
    flg: true,
    activity_id: 0 //活动id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  suspend: function () {
    if (flg == true) {
      innerAudioContext.pause()
      flg = false
      this.setData({
        flg: false
      })
    } else {

      innerAudioContext.play()
      flg = true
      this.setData({
        flg: true
      })
    }

  },
  onLoad: function (options) {
    innerAudioContext = wx.createInnerAudioContext();
    this.empty = this.selectComponent("#empty");
    this.compontNavbar = this.selectComponent("#compontNavbar");
    var name = wx.getStorageSync("rname")
        this.setData({
          tabTitle: name
        });
    console.log(options);
    let id = options.id;
    let text = options.text;
    let activity_id = options.activity_id;
    let textTranslate = [];

    console.log("歌词文件类型：",typeof text);
    console.log("歌词文件：",text);
    text = text.split(',');
    text.map(function(item,index){
      if(index%2){
        textTranslate.push(item);
      }
    });
    console.log(textTranslate);
    console.log(text);

    this.setData({
      id,
      text: textTranslate,
      activity_id: activity_id
    });
    //
    let filePath = wx.getStorageSync('filePath');
    this.startMusic(filePath);
  },
  reset: function () {
    wx.showModal({
      title: '',
      content: '确认放弃当前？',
      success(res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          });

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }  
    }) 
   
  },
  onUpload: function () {
    let filePath = wx.getStorageSync('filePath');
    //上传文件
    this.uploadFile(filePath, this.data.id);
    wx.showToast({
      title: '您以报名成功，该活动只能参加一次',
      icon: 'success',
      duration: 2000
    });
    setTimeout(function () {
        wx.navigateBack({
          delta: 3
        });
      }, 2000);
    
  },
  uploadFile: function (filePath, id) {
    let that = this;
    wx.uploadFile({
      url: app.requestUrl + 'v14/public/upload', //仅为示例，非真实的接口地址
      filePath: filePath, // 小程序临时文件路径,
      name: '$_FILES',
      success(res) {
        let data = res.data;
        //do something
        data = JSON.parse(data);
        let filelUrl = data.data[0].list[0].file_url;
        console.log(filelUrl);
        console.log(data);
        //报名
        wx.request({
          url: app.requestUrl + 'v9/activity/apply',
          data: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "app_source_type": app.app_source_type,
            "activity_id": that.data.activity_id,
            "audio_id": id,
            "audioUrl": filelUrl
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log("活动报名： ", res);
            // that.setData({
            //   list: res.data.data[0].list
            // })
          }
        })
        //
      }
    });
  },
  // 258秒 改成2:35格式
  timeFormat: function (time) {
    let m = parseInt(time / 60) < 10 ? ("0" + parseInt(time / 60)) : parseInt(time / 60);
    let s = time % 60 < 10 ? ("0" + time % 60) : time % 60;
    return m + ":" + s;
  },
  startMusic: function (audioUrl) {
    let that = this;
    //绑定音频播放地址
    
    innerAudioContext.autoplay = true
    innerAudioContext.src = audioUrl
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({
        duration: that.timeFormat(parseInt(innerAudioContext.duration))
      });
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.onTimeUpdate(function () {
      timerOut = setTimeout(function () {
        let percent = parseInt(innerAudioContext.currentTime) / parseInt(innerAudioContext.duration);
        percent = parseInt(100 * percent);
        let lastTime = parseInt(innerAudioContext.duration) - parseInt(innerAudioContext.currentTime);
        lastTime = that.timeFormat(lastTime);
        //
        that.setData({
          duration: that.timeFormat(parseInt(innerAudioContext.duration)),
          currentTime: that.timeFormat(parseInt(innerAudioContext.currentTime)),
          percent,
          lastTime
        });
      }, 1000);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //播放录音
    // let filePath = wx.getStorageSync('filePath');
    // this.startMusic(filePath);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(timerOut);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(timerOut);
    innerAudioContext.destroy();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})