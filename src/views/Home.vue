<template>
  <div class="pb-8">
    <div class="bg-gradient-to-r from-bird-primary to-blue-400 text-white rounded-2xl p-8 mb-8">
      <h2 class="text-3xl font-bold mb-2">欢迎来到观鸟图鉴</h2>
      <p class="text-blue-100 mb-4">记录你看到的每一只小鸟，点亮属于你的鸟类图鉴！</p>
      <div class="flex items-center space-x-4">
        <div class="bg-white bg-opacity-20 rounded-lg px-6 py-3">
          <span class="text-2xl font-bold">{{ totalBirds }}</span>
          <span class="text-blue-100 ml-2">种鸟类</span>
        </div>
        <div class="bg-white bg-opacity-20 rounded-lg px-6 py-3">
          <span class="text-2xl font-bold">{{ collectionCount }}</span>
          <span class="text-blue-100 ml-2">已收集</span>
        </div>
        <div class="bg-white bg-opacity-20 rounded-lg px-6 py-3">
          <span class="text-2xl font-bold">{{ Math.round(collectionCount / totalBirds * 100) }}%</span>
          <span class="text-blue-100 ml-2">完成度</span>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-800">鸟类图鉴</h3>
      <div class="relative">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索鸟类..."
          class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bird-primary"
        />
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 mb-6">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="selectedCategory = cat.id"
        :class="[
          'px-4 py-2 rounded-full font-medium transition-colors',
          selectedCategory === cat.id 
            ? 'bg-bird-primary text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-100'
        ]"
      >
        {{ cat.icon }} {{ cat.name }}
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="bird in filteredBirds" 
        :key="bird.id" 
        class="bird-card cursor-pointer"
        @click="goToDetail(bird.id)"
      >
        <div class="relative">
          <img :src="bird.image" :alt="bird.name" />
          <div 
            v-if="isCollected(bird.id)" 
            class="absolute top-2 right-2 bg-bird-green text-white rounded-full p-2"
          >
            ✨
          </div>
          <div 
            v-else 
            class="absolute top-2 right-2 bg-gray-400 text-white rounded-full p-2 opacity-50"
          >
            🔒
          </div>
        </div>
        <div class="bird-info">
          <div class="flex items-center justify-between">
            <h3>{{ bird.name }}</h3>
            <span 
              :class="[
                'text-xs px-2 py-1 rounded-full',
                bird.status === '无危' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              ]"
            >
              {{ bird.status }}
            </span>
          </div>
          <p class="text-gray-500 text-sm italic">{{ bird.scientificName }}</p>
          <p class="text-gray-400 text-xs mt-2">{{ bird.family }} · {{ bird.order }}</p>
        </div>
      </div>
    </div>

    <div v-if="filteredBirds.length === 0" class="text-center py-12">
      <span class="text-6xl block mb-4">🔍</span>
      <p class="text-gray-500">没有找到匹配的鸟类</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { birds, categories } from '../data/birds'
import { useCollection } from '../store/collection'

const router = useRouter()
const { isCollected, collectionCount } = useCollection()

const searchQuery = ref('')
const selectedCategory = ref('all')

const totalBirds = birds.length

const filteredBirds = computed(() => {
  let result = birds
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(bird => 
      bird.name.toLowerCase().includes(query) ||
      bird.scientificName.toLowerCase().includes(query) ||
      bird.family.toLowerCase().includes(query)
    )
  }
  
  if (selectedCategory.value !== 'all') {
    const categoryMap = {
      passerine: ['雀形目'],
      raptor: ['鹰形目', '隼形目'],
      waterbird: ['雁形目', '鹈形目', '鹤形目'],
      galliformes: ['鸡形目'],
      pigeon: ['鸽形目'],
      cuckoo: ['鹃形目'],
      other: ['犀鸟目', '佛法僧目', '䴕形目']
    }
    const orders = categoryMap[selectedCategory.value] || []
    result = result.filter(bird => orders.includes(bird.order))
  }
  
  return result
})

const goToDetail = (id) => {
  router.push(`/bird/${id}`)
}
</script>
