// index.js
import { uploadImage } from '../../services/api.js';

Page({
  data: {
    previewImage: '',
    processing: false,
    faces: []
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        
        this.setData({ processing: true });
        wx.showLoading({ title: '正在识别人脸...' });
        
        try {
          const result = await uploadImage(tempFilePath);
          
          if (result.code === 0 && result.data && result.data.faces) {
            this.setData({
              previewImage: tempFilePath,
              faces: result.data.faces
            });
          } else {
            throw new Error(result.message || '处理失败');
          }
        } catch (error) {
          console.error('上传图片失败:', error);
          wx.showToast({
            title: error.message || '处理失败，请查看console日志',
            icon: 'error'
          });
        } finally {
          wx.hideLoading();
          this.setData({ processing: false });
        }
      }
    });
  },

  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.previewImage,
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: () => {
        wx.showToast({
          title: '保存失败',
          icon: 'error'
        });
      }
    });
  },

  resetImage() {
    this.setData({
      previewImage: ''
    });
  },

  onShareAppMessage() {
    return {
      title: '给照片添加圣诞帽，快来试试吧！',
      path: '/pages/index/index',
      imageUrl: this.data.previewImage
    };
  }
});
