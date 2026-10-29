<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { LogoutButton } from '@/features/auth'
import { useSessionStore } from '@/entities/session'

const { isAuthenticated } = storeToRefs(useSessionStore())
</script>

<template>
  <nav aria-label="Main navigation">
    <ul class="app-nav">
      <!-- RouterLink сам додає active-class до посилання активного маршруту -->
      <li>
        <RouterLink
          class="app-nav__link"
          active-class="app-nav__link--active"
          :to="{ name: 'home' }"
        >
          Home
        </RouterLink>
      </li>
      <li>
        <RouterLink
          class="app-nav__link"
          active-class="app-nav__link--active"
          :to="{ name: 'about' }"
        >
          About author
        </RouterLink>
      </li>
      <li>
        <RouterLink
          class="app-nav__link"
          active-class="app-nav__link--active"
          :to="{ name: 'users' }"
        >
          Users
        </RouterLink>
      </li>
      <li v-if="isAuthenticated"><LogoutButton /></li>
      <li v-else>
        <RouterLink
          class="app-nav__link"
          active-class="app-nav__link--active"
          :to="{ name: 'login' }"
        >
          Login
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.app-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;

  &__link {
    display: block;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    color: var(--p-text-color);
    text-decoration: none;

    &:hover {
      background-color: var(--p-content-hover-background);
    }

    &--active {
      background-color: var(--p-primary-color);
      color: var(--p-primary-contrast-color);

      &:hover {
        background-color: var(--p-primary-hover-color);
      }
    }
  }
}
</style>
