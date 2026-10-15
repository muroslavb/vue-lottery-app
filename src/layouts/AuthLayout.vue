<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
</script>

<template>
  <main class="auth-layout">
    <div class="auth-layout__box">
      <div class="text-center mb-4">
        <AppLogo />
      </div>
      <slot />
    </div>
  </main>
</template>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-layout__box {
  width: 100%;
  max-width: 400px;
}
</style>
