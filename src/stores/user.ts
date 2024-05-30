import type { IUser } from '@/interfaces'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user: Ref<IUser> = ref({ email: '', password: '', id: '' })

  const setUser = (data: IUser) => {
    user.value = data
  }

  const logOut = () => {
    user.value = { email: '', password: '', id: '' }
  }

  return { user, setUser, logOut }
})
