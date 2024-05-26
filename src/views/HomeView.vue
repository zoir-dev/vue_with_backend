<template>
  <main>
    <h2 class="text-3xl font-bold text-center pb-4 sm:pb-8">Posts</h2>
    <div v-if="!isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="(d, index) in posts" :key="index">
        <Post :post="d" />
      </div>
    </div>
    <div v-else class="w-full h-[70vh] flex items-center justify-center">
      <q-spinner-hourglass color="primary" class="w-8 h-8 md:w-14 md:h-14" />
    </div>
  </main>
</template>

<script lang="ts">
import { http } from '@/utils/http'
import { useQuery } from '@tanstack/vue-query'
import Post from '@/components/cards/Post.vue'
import { usePostsStore } from '@/stores/posts'
import { computed } from 'vue'

export default {
  setup() {
    const postsStore = usePostsStore()
    const { isLoading, error } = useQuery({
      queryKey: ['get-posts'],
      queryFn: async () => {
        const { data } = await http.get('/post')
        postsStore.setPosts(data)
        return data
      }
    })
    const posts = computed(() => postsStore.posts)
    return {
      posts,
      isLoading,
      error
    }
  },
  components: {
    Post
  }
}
</script>
