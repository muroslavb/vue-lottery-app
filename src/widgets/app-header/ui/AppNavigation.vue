<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/entities/session/model/auth.store'
import BaseButton from '@/shared/ui/BaseButton.vue'

const auth = useAuthStore()
const router = useRouter()

async function logout(): Promise<void> {
  auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <nav aria-label="Main navigation">
    <ul class="nav nav-pills align-items-center gap-1">
      <!-- RouterLink сам додає клас з active-class до посилання активного маршруту -->
      <li class="nav-item">
        <RouterLink class="nav-link" active-class="active" :to="{ name: 'home' }">Home</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" active-class="active" :to="{ name: 'about' }">
          About author
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" active-class="active" :to="{ name: 'users' }"
          >Users</RouterLink
        >
      </li>
      <li v-if="auth.isAuthenticated" class="nav-item ms-2">
        <BaseButton variant="outline-secondary" size="sm" @click="logout">Logout</BaseButton>
      </li>
      <li v-else class="nav-item">
        <RouterLink class="nav-link" active-class="active" :to="{ name: 'login' }"
          >Login</RouterLink
        >
      </li>
    </ul>
  </nav>
</template>
