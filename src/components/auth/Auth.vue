<template>
  <div class="w-full h-[80vh] flex items-center justify-center">
    <q-card class="w-full max-w-sm dark:bg-gray-900">
      <q-card-section>
        <h4 class="text-center text-2xl md:text-3xl pb-2">{{ login ? 'Login' : 'Register' }}</h4>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            v-if="!login"
            v-model="name"
            label="Your name *"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please type something']"
            :disable="isPending"
          />

          <q-input
            v-model="email"
            label="Your email *"
            lazy-rules
            :rules="[emailRule]"
            :disable="isPending"
          />
          <q-input
            v-model="password"
            label="Your password *"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please type password']"
            :disable="isPending"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="togglePasswordVisibility"
              />
            </template>
          </q-input>

          <q-btn
            class="!w-[calc(100%-16px)]"
            label="Submit"
            type="submit"
            color="primary"
            :loading="isPending"
          />
        </q-form>
        <p class="pt-4 mb-0">
          {{ login ? "Don't have an account?" : 'Already have an account?' }}
          <router-link :to="login ? '/register' : '/login'">
            <span class="text-primary">{{ login ? 'Register' : 'Login' }}</span>
          </router-link>
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { http } from '@/utils/http'
import { useMutation } from '@tanstack/vue-query'
import { Notify } from 'quasar'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

export default {
  props: {
    login: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const isPwd = ref(true)

    const userStore = useUserStore()

    const router = useRouter()

    const emailRule = (val: string) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(val) || 'Please type a valid email'
    }

    const { mutate, isPending } = useMutation({
      mutationKey: [props.login ? 'login-user' : 'create-user'],
      mutationFn: async (formData: any) => {
        const { data } = await http.post(props.login ? 'auth/login' : 'auth/register', formData)
        localStorage.setItem('accessToken', data.accessToken)
        userStore.setUser(data.user)
        return data
      },
      onSuccess: () => {
        Notify.create({
          group: false,
          position: 'bottom-right',
          color: 'primary',
          message: props.login ? 'Login successful' : 'User created successfully'
        })
        router.push('/')
      },
      onError: (err: any) => {
        Notify.create({
          group: false,
          position: 'bottom-right',
          color: 'red',
          message: err?.response?.data?.message || err?.message
        })
      }
    })

    const onSubmit = () => {
      const formData = props.login
        ? { email: email.value, password: password.value }
        : { name: name.value, email: email.value, password: password.value }
      mutate(formData)
    }

    const onReset = () => {
      name.value = ''
      email.value = ''
      password.value = ''
    }

    const togglePasswordVisibility = () => {
      isPwd.value = !isPwd.value
    }

    return {
      name,
      email,
      password,
      isPwd,
      isPending,
      onSubmit,
      onReset,
      togglePasswordVisibility,
      emailRule
    }
  }
}
</script>
