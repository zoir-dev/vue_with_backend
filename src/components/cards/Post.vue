<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-card class="dark:bg-gray-900">
    <q-img :src="API_URL + post.img" :alt="post.title" class="w-full aspect-[4/3] object-cover">
      <template v-slot:loading>
        <q-spinner-hours color="primary" size="2em" />
      </template>
    </q-img>

    <q-card-section class="flex flex-col gap-2">
      <h4 class="font-semibold text-xl">{{ post.title }}</h4>
      <p class="text-gray-800 text-base dark:text-gray-400 m-0">{{ post.body }}</p>
    </q-card-section>
    <q-card-action class="flex gap-4 justify-end p-4 pt-2" v-if="user.email">
      <q-btn
        push
        glossy
        color="primary"
        label="Edit"
        @click="open = true"
        :disable="isPending"
      ></q-btn>
      <q-btn
        push
        glossy
        class="!bg-red-600 text-white"
        label="Delete"
        @click="mutate(post._id)"
        :loading="isPending"
      ></q-btn>
    </q-card-action>
  </q-card>
  <Modal v-model="open" :Close="() => (open = false)" :data="post" />
</template>
<script>
import { useMutation } from '@tanstack/vue-query'
import { API_URL, http } from '../../utils/http'
import { Notify } from 'quasar'
import { usePostsStore } from '@/stores/posts'
import Modal from '../modal/Modal.vue'
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup() {
    const postsStore = usePostsStore()
    const userStore = useUserStore()

    const user = computed(() => userStore.user)

    const { mutate, isPending } = useMutation({
      mutationKey: ['delete-post'],
      mutationFn: async (id) => {
        const { data } = await http.delete(`/post/${id}`)
        return data
      },
      onSuccess: (data) => {
        postsStore.setPosts(postsStore.posts.filter((f) => f._id !== data._id))
        Notify.create({
          group: false,
          position: 'bottom-right',
          color: 'primary',
          message: 'Post deleted successfully'
        })
      },
      onError: (err) => {
        Notify.create({
          group: false,
          position: 'bottom-right',
          color: 'red',
          message: err?.response?.data?.message || err.message
        })
      }
    })
    return {
      API_URL,
      mutate,
      isPending,
      open: ref(false),
      user
    }
  },
  components: {
    Modal
  }
}
</script>
