<template lang="">
  <div class="h-screen">
    <Header />
    <div class="xl:container px-5 xl:px-0 mx-auto py-4 sm:py-8">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Header from './components/header/Header.vue'
export default {
  components: {
    Header
  }
}
</script>
