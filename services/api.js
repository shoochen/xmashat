import { TENCENT_SECRET_ID, TENCENT_SECRET_KEY } from '../config/secret';

const uploadWithRetry = async (filePath, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await wx.cloud.uploadFile({
        cloudPath: `original/${Date.now()}.jpg`,
        filePath: filePath,
      });
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`上传失败，第${i + 1}次重试...`);
      await new Promise(resolve => setTimeout(resolve, 1000));  // 等待1秒后重试
    }
  }
};

export const uploadImage = async (filePath) => {
  try {
    // 确保云开发已初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      throw new Error('云开发未启用');
    }
    
    // 1. 先将图片上传到云存储
    console.log('开始上传图片到云存储');
    const uploadRes = await uploadWithRetry(filePath);
    console.log('图片上传成功:', uploadRes);

    // 2. 调用云函数处理图片
    console.log('开始调用云函数');
    const result = await wx.cloud.callFunction({
      name: 'processImage',
      data: {
        fileID: uploadRes.fileID,
      },
    });
    console.log('云函数调用结果:', JSON.stringify(result, null, 2));

    // 检查云函数返回结果
    if (!result || !result.result) {
      console.error('云函���返回结果:', result);
      throw new Error('云函数返回结果为空');
    }

    if (result.result.code !== 0) {
      console.error('云函数执行失败:', result.result);
      throw new Error(result.result.message || '云函数执行失败');
    }

    return result.result;
  } catch (error) {
    console.error('处理图片失败:', error.message, error.stack);
    console.error('详细错误信息:', error);
    throw error;
  }
}; 