<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header
    class="px-4 sm:px-7 py-4 flex items-center justify-between gap-4 shadow-md bg-gray-100 dark:bg-gray-900 dark:text-white xl:container mx-auto rounded-b-xl"
  >
    <router-link to="/">
      <div class="flex items-center gap-3">
        <img class="w-10" src="../../assets/logo.svg" alt="Logo" />
        <p class="text-lg font-bold m-0">Posts with <span class="text-primary">Vue</span></p>
      </div>
    </router-link>
    <div class="flex items-center w-full sm:w-auto justify-end gap-6 sm:justify-between">
      <q-btn push color="primary" @click="open = true" v-if="user.email">Create post</q-btn>
      <q-spinner-hourglass color="primary" size="2em" v-if="loading"></q-spinner-hourglass>
      <router-link to="/login" v-if="!user.email && !loading">
        <q-btn color="primary" flat>Login</q-btn>
      </router-link>
      <q-avatar
        color="primary"
        textColor="white"
        icon="person"
        class="cursor-pointer"
        size="lg"
        v-if="user.email && !loading"
      >
        <q-menu
          transition-show="jump-down"
          transition-hide="jump-up"
          :offset="[50, 10]"
          class="dark:bg-gray-900"
        >
          <q-list>
            <q-item v-close-popup>
              <q-item-section>{{ user?.email }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="logout">
              <q-item-section class="text-red-600">Log out</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-avatar>
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
import { ref, onMounted, watch, computed } from 'vue'
import { Dark, Notify } from 'quasar'
import Modal from '../modal/Modal.vue'
import { useUserStore } from '@/stores/user'
import { http } from '@/utils/http'

export default {
  components: {
    Modal
  },
  setup() {
    const open = ref(false)
    const darkMode = ref(JSON.parse(localStorage.getItem('theme') || 'false'))
    const token = ref(localStorage.getItem('accessToken'))

    const userStore = useUserStore()

    const changeTheme = (isDark) => {
      localStorage.setItem('theme', JSON.stringify(isDark))
      if (isDark) {
        document.body.classList.add('dark')
        Dark.set(true)
      } else {
        document.body.classList.remove('dark')
        Dark.set(false)
      }
    }

    const logout = async () => {
      try {
        await http.post('/auth/logout')
        localStorage.removeItem('accessToken')
        token.value = null
        userStore.logOut()
      } catch (error) {
        Notify.create({
          group: false,
          position: 'bottom-right',
          color: 'red',
          message: error.response.data.message || error.message
        })
      }
    }

    const user = computed(() => userStore.user)

    watch(localStorage.getItem('accessToken'), () => {
      token.value = localStorage.getItem('accessToken')
    })

    onMounted(() => {
      changeTheme(darkMode.value)
      token.value = localStorage.getItem('accessToken')
      if (token.value) {
        checkAuth()
      }
    })

    const loading = ref(false)
    const checkAuth = async () => {
      try {
        loading.value = true
        const { data } = await http.get('auth/refresh')
        localStorage.setItem('accessToken', data.accessToken)
        userStore.setUser(data.user)
      } catch (error) {
        ;() => {}
      } finally {
        loading.value = false
      }
    }

    return {
      open,
      darkMode,
      token,
      changeTheme,
      logout,
      user,
      loading
    }
  }
}
</script>
