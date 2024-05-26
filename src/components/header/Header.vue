<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header
    class="px-4 sm:px-7 py-4 flex items-center justify-between shadow-md bg-gray-100 dark:bg-gray-900 dark:text-white xl:container mx-auto rounded-b-xl"
  >
    <router-link to="/">
      <div class="flex items-center gap-3">
        <img class="w-10" src="../../assets/logo.svg" alt="" />
        <p class="text-lg font-bold m-0">Posts with <span class="text-primary">Vue</span></p>
      </div>
    </router-link>
    <div class="flex items-center gap-6">
      <q-btn push color="primary" @click="open = true">Create post</q-btn>
      <router-link to="/auth">
        <q-btn color="primary" flat>Login</q-btn>
      </router-link>
      <div class="checkbox-wrapper-54 scale-95 sm:scale-100">
        <label class="switch">
          <input type="checkbox" :checked="darkMode" @input="changeTheme($event.target.checked)" />
          <span class="slider"></span>
        </label>
      </div>
    </div>
  </header>
  <Modal v-model="open" :Close="() => (open = false)" />
</template>
<script>
import Icon from '@/components/icons/IconCommunity.vue'
import Modal from '../modal/Modal.vue'
import { ref } from 'vue'
import { Dark } from 'quasar'
export default {
  data() {
    return {
      darkMode: false
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Icon,
    Modal
  },
  methods: {
    changeTheme(e) {
      localStorage.setItem('theme', `${e}`)
      if (
        localStorage.theme === 'true' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.body.classList.add('dark')
        Dark.set(true)
      } else {
        document.body.classList.remove('dark')
        Dark.set(false)
      }
    }
  },
  mounted() {
    this.darkMode = JSON.parse(localStorage.getItem('theme') || 'false')
    this.changeTheme(this.darkMode)
  },
  setup() {
    return {
      open: ref(false)
    }
  }
}
</script>
<style></style>
