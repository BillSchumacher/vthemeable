<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <Card />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />

</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { defineAsyncComponent } from 'vue'
export default {
  name: 'App',
  components: {
    Card: defineAsyncComponent(() => {
      return import('./components/Card/Card.vue')
    }),
    HelloWorld
  }
}
</script>
