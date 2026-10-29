<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { LoginForm } from '@/features/auth'
import { getSafeRedirect } from '@/shared/lib'
import { AppCard } from '@/shared/ui'

const route = useRoute()
const router = useRouter()

// повертаємося на сторінку, яку користувач відкривав до редіректу на /login
async function onSuccess(): Promise<void> {
  await router.push(getSafeRedirect(route.query.redirect) ?? { name: 'users' })
}
</script>

<template>
  <AppCard title="Login">
    <p class="login-page__hint">Test account: emilys / emilyspass</p>
    <LoginForm @success="onSuccess" />
  </AppCard>
</template>

<style scoped lang="scss">
.login-page__hint {
  margin-top: 0;
  color: var(--p-text-muted-color);
}
</style>
