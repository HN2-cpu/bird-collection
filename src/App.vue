<template>
  <div class="min-h-screen bg-bird-bg">
    <nav class="navbar">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-3xl">🐦</span>
          <h1 class="text-xl font-bold text-bird-primary">观鸟图鉴</h1>
        </div>
        <div class="flex items-center space-x-4">
          <router-link to="/" :class="['nav-link', $route.name === 'Home' ? 'active' : '']">
            <span>🏠</span> 首页
          </router-link>
          <router-link to="/collection" :class="['nav-link', $route.name === 'Collection' ? 'active' : '']">
            <span>📚</span> 我的图鉴
          </router-link>
          <router-link to="/gallery" :class="['nav-link', $route.name === 'Gallery' ? 'active' : '']">
            <span>🖼️</span> 我的相册
          </router-link>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
            <span>✨</span>
            <span class="text-sm font-bold text-bird-primary">{{ collectionCount }}/{{ totalBirds }}</span>
          </div>
          <div class="relative">
            <button @click="showBackupMenu = !showBackupMenu" class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <span>💾</span>
              <span class="text-sm">备份</span>
            </button>
            <div v-if="showBackupMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <button @click="handleExport" class="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 flex items-center space-x-2">
                <span>📤</span>
                <span>导出数据</span>
              </button>
              <div class="border-t border-gray-100 my-2"></div>
              <label class="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 flex items-center space-x-2 cursor-pointer">
                <span>📥</span>
                <span>导入数据</span>
                <input ref="importFile" type="file" accept=".json" class="hidden" @change="handleImport" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto px-4 py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCollection } from './store/collection'
import { birds } from './data/birds'

const { collectionCount, exportData, importData } = useCollection()
const totalBirds = birds.length

const showBackupMenu = ref(false)
const importFile = ref(null)

const handleExport = () => {
  exportData()
  showBackupMenu.value = false
}

const handleImport = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      await importData(file)
      alert('数据导入成功！')
      showBackupMenu.value = false
      location.reload()
    } catch (error) {
      alert('导入失败：' + error.message)
    }
  }
}
</script>
