import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])

  const setPosts = (data: any) => {
    posts.value = data
  }

  const deletePost = (id: number) => {
    posts.value = posts.value.filter((p: any) => p._id !== id)
  }

  const updatePost = (data: any) => {
    posts.value = posts.value.map((p: any) => (p._id === data._id ? data : p))
  }

  return { posts, setPosts, deletePost, updatePost }
})
