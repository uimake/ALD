// pages/ailangdu//pages/index/index.js
const network = require("../../../../utils/main.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    current: 0
  },
  // swiper
  change: function(e){
    console.log(e.detail.current);
    this.setData({
      current: e.detail.current
    });
  },
  getSwipImgs: function () {
    var that = this;
    //正式使用改成11 爱朗读
    network.getSwiperImgs(1, function (res) {
      if (res.data.code == 200) {
        that.setData({
          imgUrls: res.data.data[0].list
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwipImgs();
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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