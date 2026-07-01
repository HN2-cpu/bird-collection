<template>
  <div v-if="bird" class="pb-8">
    <button @click="goBack" class="btn-secondary mb-6 flex items-center space-x-2">
      <span>←</span>
      <span>返回</span>
    </button>

    <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      <div class="relative h-80">
        <img :src="bird.image" :alt="bird.name" class="w-full h-full object-cover" />
        <div 
          v-if="isCollected(bird.id)" 
          class="absolute top-4 right-4 bg-bird-green text-white rounded-full px-4 py-2 flex items-center space-x-2"
        >
          <span>✨</span>
          <span class="font-bold">已收集</span>
        </div>
      </div>
      <div class="p-8">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ bird.name }}</h1>
            <p class="text-gray-500 italic text-lg">{{ bird.scientificName }}</p>
          </div>
          <button 
            @click="toggleCollect"
            :class="[
              'px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105',
              isCollected(bird.id) 
                ? 'bg-gray-200 text-gray-600' 
                : 'bg-bird-green text-white'
            ]"
          >
            {{ isCollected(bird.id) ? '取消收集' : '收集鸟类' }}
          </button>
        </div>
        
        <div class="flex flex-wrap gap-4 mb-6">
          <span class="bg-blue-100 text-blue-600 px-4 py-2 rounded-full">
            {{ bird.family }}
          </span>
          <span class="bg-purple-100 text-purple-600 px-4 py-2 rounded-full">
            {{ bird.order }}
          </span>
          <span 
            :class="[
              'px-4 py-2 rounded-full',
              bird.status === '无危' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            ]"
          >
            {{ bird.status }}
          </span>
        </div>

        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <span class="mr-2">📝</span> 简介
            </h3>
            <p class="text-gray-600 leading-relaxed">{{ bird.description }}</p>
          </div>
          
          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <span class="mr-2">🏠</span> 栖息地
            </h3>
            <p class="text-gray-600 leading-relaxed">{{ bird.habitat }}</p>
          </div>
          
          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <span class="mr-2">🌍</span> 分布范围
            </h3>
            <p class="text-gray-600 leading-relaxed">{{ bird.distribution }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-800 flex items-center">
          <span class="mr-2">📸</span> 我的照片 ({{ photos.length }})
        </h2>
        <button @click="showUploadModal = true" class="btn-primary flex items-center space-x-2">
          <span>+</span>
          <span>上传照片</span>
        </button>
      </div>

      <div v-if="photos.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="photo in photos" 
          :key="photo.id" 
          class="relative rounded-xl overflow-hidden group"
        >
          <img :src="photo.data" class="w-full h-48 object-cover" />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
            <button 
              @click="removePhoto(bird.id, photo.id)" 
              class="bg-red-500 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              删除
            </button>
          </div>
          <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
            {{ photo.date }}
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <span class="text-6xl block mb-4">📷</span>
        <p class="text-gray-500 mb-4">还没有上传照片</p>
        <button @click="showUploadModal = true" class="btn-primary">上传你的第一张照片</button>
      </div>
    </div>

    <div v-if="showUploadModal" class="modal-overlay" @click.self="showUploadModal = false">
      <div class="modal-content">
        <h3 class="text-xl font-bold text-gray-800 mb-4">上传照片</h3>
        <div 
          class="upload-area"
          @click="triggerFileInput"
          @dragover.prevent="isDragover = true"
          @dragleave="isDragover = false"
          @drop.prevent="handleDrop"
          :class="{ dragover: isDragover }"
        >
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*" 
            class="hidden"
            @change="handleFileSelect"
          />
          <span class="text-4xl block mb-4">📁</span>
          <p class="text-gray-600">点击或拖拽图片到这里上传</p>
          <p class="text-gray-400 text-sm mt-2">支持 JPG、PNG 格式</p>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="showUploadModal = false" class="btn-secondary">取消</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <span class="text-6xl block mb-4">🔍</span>
    <p class="text-gray-500">鸟类不存在</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { birds } from '../data/birds'
import { useCollection } from '../store/collection'

const route = useRoute()
const router = useRouter()
const { isCollected, collectBird, uncollectBird, addPhoto, removePhoto, getPhotos } = useCollection()

const birdId = ref(null)
const showUploadModal = ref(false)
const isDragover = ref(false)
const fileInput = ref(null)

const bird = computed(() => birds.find(b => b.id === birdId.value))
const photos = computed(() => bird.value ? getPhotos(bird.value.id) : [])

onMounted(() => {
  birdId.value = parseInt(route.params.id)
})

const goBack = () => {
  router.push('/')
}

const toggleCollect = () => {
  if (isCollected(birdId.value)) {
    uncollectBird(birdId.value)
  } else {
    collectBird(birdId.value)
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event) => {
  isDragover.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const processFile = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    addPhoto(birdId.value, e.target.result)
    showUploadModal.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
  reader.readAsDataURL(file)
}
</script>
