import { reactive, computed } from 'vue'

const STORAGE_KEY = 'bird_collection_data'

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {
      collectedBirds: [],
      userPhotos: {}
    }
  } catch {
    return {
      collectedBirds: [],
      userPhotos: {}
    }
  }
}

const saveToStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const state = reactive(loadFromStorage())

export const useCollection = () => {
  const collectedBirds = computed(() => state.collectedBirds)
  const userPhotos = computed(() => state.userPhotos)

  const isCollected = (birdId) => {
    return state.collectedBirds.includes(birdId)
  }

  const collectBird = (birdId) => {
    if (!state.collectedBirds.includes(birdId)) {
      state.collectedBirds.push(birdId)
      saveToStorage(state)
    }
  }

  const uncollectBird = (birdId) => {
    const index = state.collectedBirds.indexOf(birdId)
    if (index > -1) {
      state.collectedBirds.splice(index, 1)
      saveToStorage(state)
    }
  }

  const addPhoto = (birdId, photoData) => {
    if (!state.userPhotos[birdId]) {
      state.userPhotos[birdId] = []
    }
    state.userPhotos[birdId].push({
      id: Date.now(),
      data: photoData,
      date: new Date().toLocaleDateString('zh-CN')
    })
    saveToStorage(state)
    collectBird(birdId)
  }

  const removePhoto = (birdId, photoId) => {
    if (state.userPhotos[birdId]) {
      const index = state.userPhotos[birdId].findIndex(p => p.id === photoId)
      if (index > -1) {
        state.userPhotos[birdId].splice(index, 1)
        if (state.userPhotos[birdId].length === 0) {
          delete state.userPhotos[birdId]
        }
        saveToStorage(state)
      }
    }
  }

  const getPhotos = (birdId) => {
    return state.userPhotos[birdId] || []
  }

  const collectionCount = computed(() => state.collectedBirds.length)

  const exportData = () => {
    const dataStr = JSON.stringify(state)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bird-collection-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.collectedBirds && Array.isArray(data.collectedBirds)) {
            state.collectedBirds = data.collectedBirds
          }
          if (data.userPhotos && typeof data.userPhotos === 'object') {
            state.userPhotos = data.userPhotos
          }
          saveToStorage(state)
          resolve(true)
        } catch (error) {
          reject(new Error('无效的备份文件'))
        }
      }
      reader.onerror = () => {
        reject(new Error('文件读取失败'))
      }
      reader.readAsText(file)
    })
  }

  return {
    collectedBirds,
    userPhotos,
    isCollected,
    collectBird,
    uncollectBird,
    addPhoto,
    removePhoto,
    getPhotos,
    collectionCount,
    exportData,
    importData
  }
}
