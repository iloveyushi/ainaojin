<template>
  <div class="room-container">
    <h2>AI急转弯 - 房间列表</h2>
    
    <!-- 错误提示 -->
    <div v-if="errorMsg" class="error-box">
      {{ errorMsg }}
    </div>
    
    <!-- 空数据提示 -->
    <div v-else-if="roomList.length === 0" class="empty-box">
      暂无房间数据，快去创建第一个房间吧！
    </div>
    
    <!-- 房间列表渲染 -->
    <div v-else class="room-list">
      <div v-for="(room, index) in roomList" :key="index" class="room-item">
        {{ room }}
      </div>
    </div>
  </div>
</template>

<script>
import { getRoomList } from '@/api/room'

export default {
  name: 'RoomList',
  data() {
    return {
      roomList: [], // 房间列表数据
      errorMsg: ''  // 错误提示信息
    }
  },
  mounted() {
    // 页面加载时请求房间列表
    this.fetchRoomList()
  },
  methods: {
    /**
     * 请求房间列表数据
     */
    async fetchRoomList() {
      try {
        // 发起请求
        const res = await getRoomList()
        // 校验后端响应码
        if (res.data.code === 200) {
          this.roomList = res.data.data // 赋值房间列表
          this.errorMsg = '' // 清空错误提示
        } else {
          this.errorMsg = res.data.msg || '获取房间列表失败'
        }
      } catch (err) {
        // 捕获网络/请求异常
        this.errorMsg = '服务器连接失败，请检查后端是否启动！'
        // 控制台打印错误详情（方便调试）
        console.error('请求房间列表失败：', err)
      }
    }
  }
}
</script>

<style scoped>
.room-container {
  width: 80%;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}
.error-box {
  color: #f56c6c;
  padding: 10px;
  background-color: #fef0f0;
  border-radius: 4px;
  margin-bottom: 10px;
}
.empty-box {
  color: #909399;
  padding: 20px;
  text-align: center;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}
.room-list {
  margin-top: 10px;
}
.room-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>