<template lang="">
  <q-dialog backdrop-filter="blur(10px)" persistent>
    <div class="p-5 bg-gray-50 dark:!bg-gray-900 !max-w-sm w-full">
      <h2 class="text-xl font-bold pb-6">{{ data ? 'Edit' : 'Create' }} Post</h2>
      <q-form @submit="onSubmit" @reset="onReset" class="w-full">
        <q-input
          v-if="!data"
          v-model="img"
          type="file"
          ref="fileInput"
          accept=".png, .jpg, .jpeg"
          change="onFileChange"
          :rules="[(val) => (val && val.length > 0) || 'Select Image']"
          :disable="isPending"
        />
        <q-input
          v-model="title"
          label="Title"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Enter Title']"
          :disable="isPending"
        />

        <q-input
          v-model="body"
          label="Body"
          autogrow
          lazy-rules
          :rules="[(val) => (val !== null && val !== '') || 'Enter Body']"
          :disable="isPending"
        />
        <div class="pt-2 flex justify-end">
          <q-btn label="Submit" type="submit" :loading="isPending" push color="primary" />
          <q-btn
            label="Close"
            type="reset"
            :disable="isPending"
            v-close-popup
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </q-dialog>
</template>
<script>
import { usePostsStore } from '@/stores/posts'
import { http } from '@/utils/http'
import { useMutation } from '@tanstack/vue-query'
import { Notify } from 'quasar'
import { ref } from 'vue'

export default {
  props: {
    data: {
      type: Object,
      required: false
    },
    Close: {
      type: Function,
      required: false
    }
  },
  setup(props) {
    const title = ref(null)
    const body = ref(null)
    const img = ref(null)
    const postsStore = usePostsStore()

    if (props.data) {
      title.value = props.data.title
      body.value = props.data.body
    }

    const { mutate, isPending } = useMutation({
      mutationKey: ['create-post'],
      mutationFn: async (formData) => {
        if (props.data) {
          const { data } = await http.put(`/post/${props.data._id}`, formData)
          postsStore.updatePost(data)
          return data
        } else {
          const { data } = await http.post('/post', formData)
          postsStore.addPost(data)
          return data
        }
      },
      onSuccess: () => {
        Notify.create({
          group: false,
          position: 'bottom-right',
          color: 'primary',
          message: props.data ? 'Post updated successfully' : 'Post created successfully'
        })
        props.Close()
      },
      onError: (err) => {
        Notify.create({
          group: false,
          position: 'bottom-right',
          color: 'red',
          message: err.response.data.message || err.message
        })
      }
    })

    return {
      title,
      body,
      img,
      mutate,
      isPending,
      onFileChange(event) {
        img.value = event.target.files[0]
      },
      onReset() {
        if (!props.data) {
          title.value = null
          body.value = null
          img.value = null
        }
      },
      onSubmit() {
        if (
          props.data ? title.value === props.data.title && body.value === props.data.body : false
        ) {
          Notify.create({
            group: false,
            position: 'bottom-right',
            color: 'info',
            message: 'Add changes to edit!'
          })
        } else {
          const formData = new FormData()
          if (!props.data && img.value) {
            formData.append('img', ...img.value)
          }
          formData.append('title', title.value)
          formData.append('body', body.value)
          mutate(formData)
        }
      }
    }
  }
}
</script>
