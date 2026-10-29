<script setup lang="ts">
import { AppLogo } from '@/widgets/app-header'
</script>

<template>
  <main class="auth-layout">
    <div class="auth-layout__box">
      <div class="auth-layout__logo">
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

  &__box {
    width: 100%;
    max-width: 400px;
  }

  &__logo {
    margin-bottom: 1.5rem;
    text-align: center;
  }
}
</style>
