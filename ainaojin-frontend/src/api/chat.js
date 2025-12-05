import axios from 'axios'

// 创建axios实例，走vite proxy代理（解决跨域）
const service = axios.create({
  baseURL: '/api', // 关键：相对路径，匹配vite.config.js的proxy规则
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
})

// 请求拦截器：打印请求日志（方便调试）
service.interceptors.request.use(
  (config) => {
    console.log('【请求配置】', config.url, config.params);
    return config;
  },
  (error) => {
    console.error('【请求错误】', error);
    return Promise.reject(error);
  }
)

// 响应拦截器：统一处理响应
service.interceptors.response.use(
  (response) => {
    console.log('【响应数据】', response.data);
    // 后端直接返回字符串，无需解析code
    return response.data;
  },
  (error) => {
    const errMsg = error.response 
      ? `接口错误：${error.response.status} ${error.response.statusText}`
      : `网络错误：${error.message}`;
    console.error('【响应错误】', errMsg);
    return Promise.reject(errMsg);
  }
)

// 获取房间列表
export const getRooms = () => {
  return service.get('/rooms');
}

// 发送聊天消息
export const sendChat = (roomId, userPrompt) => {
  return service.post(`/${roomId}/chat`, null, {
    params: { userPrompt }
  });
}