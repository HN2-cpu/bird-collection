<template>
  <div class="pb-8">
    <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">我的图鉴收藏</h2>
          <p class="text-gray-500">已收集 {{ collectionCount }} / {{ totalBirds }} 种鸟类</p>
        </div>
        <div class="text-right">
          <span class="text-5xl font-bold text-bird-primary">{{ Math.round(collectionCount / totalBirds * 100) }}%</span>
          <p class="text-gray-400 text-sm">完成度</p>
        </div>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: Math.round(collectionCount / totalBirds * 100) + '%' }"
        ></div>
      </div>
    </div>

    <div v-if="collectionCount > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="bird in collectedBirdsList" 
        :key="bird.id" 
        class="bird-card cursor-pointer"
        @click="goToDetail(bird.id)"
      >
        <div class="relative">
          <img :src="bird.image" :alt="bird.name" />
          <div class="absolute top-2 right-2 bg-bird-green text-white rounded-full p-2">
            ✨
          </div>
        </div>
        <div class="bird-info">
          <h3>{{ bird.name }}</h3>
          <p class="text-gray-500 text-sm italic">{{ bird.scientificName }}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-gray-400 text-xs">{{ bird.family }}</span>
            <span class="text-bird-accent text-xs font-bold">
              {{ getPhotos(bird.id).length }} 张照片
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-2xl shadow-lg p-12 text-center">
      <span class="text-6xl block mb-4">🔒</span>
      <h3 class="text-xl font-bold text-gray-800 mb-2">还没有收集任何鸟类</h3>
      <p class="text-gray-500 mb-6">去首页浏览鸟类图鉴，开始你的观鸟之旅吧！</p>
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
const { collectedBirds, collectionCount, getPhotos } = useCollection()

const totalBirds = birds.length

const collectedBirdsList = computed(() => {
  return birds.filter(bird => collectedBirds.value.includes(bird.id))
})

const goToDetail = (id) => {
  router.push(`/bird/${id}`)
}

const goToHome = () => {
  router.push('/')
}
</script>
