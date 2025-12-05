<template>
  <div class="first-page">
    <h1 class="title">AI 急转弯</h1>
    <a-button 
      type="primary" 
      size="large" 
      @click="startGame"
      class="start-btn"
    >
      点击开始
    </a-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const generateRoomId = () => {
  return Date.now() + Math.floor(Math.random() * 1000)
}

const startGame = () => {
  const roomId = generateRoomId()
  router.push({ name: 'ChatRoom', params: { roomId } })
}
</script>

<style scoped>
.first-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.title {
  font-size: 3rem;
  color: #1890ff;
  margin-bottom: 2rem;
}

.start-btn {
  font-size: 1.2rem;
  padding: 1rem 2rem;
}
</style>