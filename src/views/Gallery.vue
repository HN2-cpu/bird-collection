<template>
  <div class="pb-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">我的相册</h2>
      <p class="text-gray-500">共 {{ totalPhotos }} 张照片</p>
    </div>

    <div v-if="allPhotos.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="photo in allPhotos" 
        :key="photo.id" 
        class="bg-white rounded-xl shadow-md overflow-hidden group"
      >
        <div class="relative">
          <img :src="photo.data" class="w-full h-56 object-cover" />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
            <button 
              @click="deletePhoto(photo.birdId, photo.id)" 
              class="bg-red-500 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              删除
            </button>
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <img :src="getBirdImage(photo.birdId)" class="w-8 h-8 rounded-full object-cover" />
              <span class="font-medium text-gray-800">{{ getBirdName(photo.birdId) }}</span>
            </div>
            <span class="text-gray-400 text-sm">{{ photo.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-2xl shadow-lg p-12 text-center">
      <span class="text-6xl block mb-4">📷</span>
      <h3 class="text-xl font-bold text-gray-800 mb-2">还没有上传照片</h3>
      <p class="text-gray-500 mb-6">去鸟类详情页上传你拍摄的小鸟照片吧！</p>
      <button @click="goToHome" class="btn-primary">去浏览图鉴</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { birds } from '../data/birds'
import { useCollection } from '../store/collection'

const router = useRouter()
const { userPhotos, removePhoto } = useCollection()

const allPhotos = computed(() => {
  const photos = []
  for (const birdId in userPhotos.value) {
    const birdPhotos = userPhotos.value[birdId]
    birdPhotos.forEach(photo => {
      photos.push({
        ...photo,
        birdId: parseInt(birdId)
      })
    })
  }
  return photos.sort((a, b) => b.id - a.id)
})

const totalPhotos = computed(() => allPhotos.value.length)

const getBirdName = (birdId) => {
  const bird = birds.find(b => b.id === birdId)
  return bird ? bird.name : '未知鸟类'
}

const getBirdImage = (birdId) => {
  const bird = birds.find(b => b.id === birdId)
  return bird ? bird.image : ''
}

const deletePhoto = (birdId, photoId) => {
  if (confirm('确定要删除这张照片吗？')) {
    removePhoto(birdId, photoId)
  }
}

const goToHome = () => {
  router.push('/')
}
</script>
