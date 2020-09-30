// pages/weather/weather.js
var day = ["今天", "明天", "后天"]
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: day,
    locationName: '',
    city: '',
    district: '',
    street: ''
  },

  // 地址输入框
  locationInput(e) {
    this.setData({
      locationName: e.detail.value
    })
  },

  // 搜索按钮 
  search(e) {
    var that = this
    if (this.data.locationName == 0) {
      wx.showToast({
        title: '请输入城市名！',
        icon: 'loading',
        duration: 1500
      })
    } else {
      that.getLocationId(this.data.locationName)
      that.setData({
        city: this.data.locationName,
        district: '',
        street: ''
      })
    }
  },

  // 获取和风天气城市ID(城市名)
  getLocationId(locationName) {
    var that = this
    var url = 'https://geoapi.heweather.net/v2/city/lookup'
    console.log(locationName)
    var params = {
      location: locationName,
      number: 1,
      key: app.globalData.heKey
    }
    wx.request({
      url: url,
      data: params,
      success: e => {
        console.log(e)
        if (e.data.code === '400') {
          wx.showToast({
            title: '不存在该城市！',
            icon: 'loading',
            duration: 1500
          })
        }
        else{
          var id = e.data.location[0].id
          console.log(id)
          that.getWeather(id)
        }
      }
    })
  },
  // 获取经纬度
  getLocation() {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log("lat:" + latitude + " lon:" + longitude);

        that.getCity(latitude, longitude);
      }
    })
  },

  // 获取城市信息（参数：经纬度）
  getCity(latitude, longitude) {
    var that = this
    var url = "https://restapi.amap.com/v3/geocode/regeo"
    var params = {
      key: app.globalData.amapKey,
      location: longitude + ',' + latitude,
      poitype: '',
      radius: 1000,
      extensions: 'all',
      batch: false,
      roadlevel: 0
    }
    wx.request({
      url: url,
      data: params,
      success: e => {
        console.log(e)
        this.data.city = e.data.regeocode.addressComponent.city
        this.data.district = e.data.regeocode.addressComponent.district
        this.data.street = e.data.regeocode.addressComponent.streetNumber.street

        that.setData({
          city: this.data.city,
          district: this.data.district,
          street: this.data.street,
        })
        that.getLocationId(this.data.city)
      }
    })
  },

  // 获取天气信息
  getWeather(id) {
    var that = this
    var url = 'https://devapi.heweather.net/v7/weather/now'
    var params = {
      location: id,
      key: app.globalData.heKey
    }
    that.get3dWeather(id)
    that.getPM(id)
    wx.request({
      url: url,
      data: params,
      success: e => {
        console.log(e)
        this.setData({
          tmp: e.data.now.temp,
          txt: e.data.now.text,
          dir: e.data.now.windDir,
          sc: e.data.now.windScale,
          hum: e.data.now.humidity,
          fl: e.data.now.feelsLike,
          updateTime: e.data.updateTime
        })
      }
    })
  },

  getPM(id) {
    var that = this
    var url = 'https://devapi.heweather.net/v7/air/now'
    var params = {
      location: id,
      key: app.globalData.heKey,
    }
    wx.request({
      url: url,
      data: params,
      success: e => {
        console.log(e)
        that.setData({
          qlty: e.data.now.category
        })
      }
    })
  },

  // 获取三天天气情况
  get3dWeather(id) {
    var that = this
    var url = 'https://devapi.heweather.net/v7/weather/3d'
    var params = {
      location: id,
      key: app.globalData.heKey
    }
    wx.request({
      url: url,
      data: params,
      success: e => {
        console.log(e)
        that.setData({
          daily_forecast: e.data.daily
        })
        // console.log(e.data.daily)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getLocation();
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