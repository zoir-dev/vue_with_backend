<!-- eslint-disable vue/multi-word-component-names -->
<template lang="">
  <Auth :login="true" />
</template>
<script lang="ts">
import Auth from '../components/auth/Auth.vue'
export default {
  components: {
    Auth
  }
}
</script>
