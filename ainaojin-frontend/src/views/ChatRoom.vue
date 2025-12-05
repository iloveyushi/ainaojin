<template>
  <div class="chat-room">
    <!-- 房间标题 -->
    <div class="header">
      <h2>AI急转弯 - 房间号：{{ roomId }}</h2>
    </div>

    <!-- 聊天消息区域 -->
    <div class="chat-box">
      <div class="message" v-for="(item, index) in messageList" :key="index">
        <div :class="['msg-item', item.type]">
          <span class="avatar">{{ item.type === 'ai' ? '🤖' : '👤' }}</span>
          <span class="content">{{ item.content }}</span>
        </div>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="btn-group">
      <button @click="startGame" :disabled="gameStarted" class="start-btn">开始游戏</button>
      <button @click="endGame" :disabled="gameEnded" class="end-btn">结束游戏</button>
    </div>

    <!-- 输入和发送区域（核心：移除所有多余禁用逻辑） -->
    <div class="input-area">
      <input
        type="text"
        v-model="inputText"
        placeholder="输入答案（如：球门）"
        :disabled="gameEnded"
        class="input"
      >
      <!-- 仅在游戏结束时禁用，无其他条件 -->
      <button @click="sendMsg" :disabled="gameEnded" class="send-btn">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

// ========== 核心状态（极简，无复杂依赖） ==========
// 房间ID（兜底生成，避免undefined）
const roomId = ref(Math.floor(Math.random() * 1000000).toString())
// 输入框内容
const inputText = ref('')
// 游戏状态（初始均为false，确保按钮可用）
const gameStarted = ref(false)
const gameEnded = ref(false)
// 消息列表
const messageList = reactive([
  { type: 'ai', content: '欢迎来到AI急转弯！点击【开始游戏】开始挑战～' }
])

// ========== 后端请求封装（极简，直接请求） ==========
/**
 * 发送消息到后端
 * @param {string} prompt 输入内容
 */
const sendToBackend = async (prompt) => {
  try {
    // 直接请求后端，不走代理（避免proxy配置问题）
    const res = await axios.post(
      `http://localhost:8080/${roomId.value}/chat`,
      null,
      { params: { userPrompt: prompt } }
    )
    return res.data || '收到消息，但后端未返回内容'
  } catch (err) {
    console.error('请求失败：', err)
    return `请求失败！请检查后端是否运行在8080端口\n错误信息：${err.message}`
  }
}

// ========== 核心交互逻辑 ==========
// 开始游戏
const startGame = async () => {
  if (gameStarted.value) return
  // 添加用户消息
  messageList.push({ type: 'user', content: '开始游戏' })
  // 请求后端
  const reply = await sendToBackend('开始')
  // 添加AI回复
  messageList.push({ type: 'ai', content: reply })
  // 更新状态
  gameStarted.value = true
  gameEnded.value = false
}

// 结束游戏
const endGame = async () => {
  if (gameEnded.value) return
  // 添加用户消息
  messageList.push({ type: 'user', content: '结束游戏' })
  // 请求后端
  const reply = await sendToBackend('结束')
  // 添加AI回复
  messageList.push({ type: 'ai', content: reply + '\n【游戏已结束】' })
  // 更新状态
  gameEnded.value = true
}

// 发送输入框消息
const sendMsg = async () => {
  // 空内容校验（提示而非禁用按钮）
  const prompt = inputText.value.trim()
  if (!prompt) {
    messageList.push({ type: 'ai', content: '输入内容不能为空哦！' })
    return
  }

  // 添加用户消息
  messageList.push({ type: 'user', content: prompt })
  // 请求后端
  const reply = await sendToBackend(prompt)
  // 添加AI回复
  messageList.push({ type: 'ai', content: reply })
  
  // 清空输入框
  inputText.value = ''
  
  // 若输入“开始”且未开始，自动标记开始
  if (prompt === '开始' && !gameStarted.value) {
    gameStarted.value = true
  }
  // 若输入“结束”且未结束，自动标记结束
  if (prompt === '结束' && !gameEnded.value) {
    gameEnded.value = true
  }
}
</script>

<style scoped>
/* 基础样式，无复杂依赖，确保页面加载 */
.chat-room {
  width: 100%;
  max-width: 800px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  box-sizing: border-box;
}

.header {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #eee;
  background: #f8f8f8;
}

.header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.chat-box {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #fafafa;
}

.message {
  margin-bottom: 12px;
}

.msg-item {
  display: flex;
  align-items: flex-start;
  max-width: 70%;
}

.msg-item.ai {
  align-self: flex-start;
}

.msg-item.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.avatar {
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 50%;
  background: #eee;
  margin: 0 8px;
  font-size: 16px;
}

.content {
  padding: 8px 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #eee;
  line-height: 1.4;
  white-space: pre-wrap;
}

.msg-item.user .content {
  background: #1890ff;
  color: #fff;
  border: none;
}

.btn-group {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  gap: 12px;
  background: #fff;
}

.start-btn, .end-btn {
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.start-btn {
  background: #1890ff;
  color: #fff;
}

.end-btn {
  background: #ff4d4f;
  color: #fff;
}

.start-btn:disabled, .end-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-area {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 8px;
  background: #fff;
}

.input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  outline: none;
}

.input:disabled {
  background: #f5f5f5;
  color: #999;
}

.send-btn {
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  background: #1890ff;
  color: #fff;
  cursor: pointer;
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>