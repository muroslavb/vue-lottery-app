<script setup lang="ts">
import AppHeader from '@/widgets/app-header/ui/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="container app-container app-main">
    <slot />
  </main>
</template>
