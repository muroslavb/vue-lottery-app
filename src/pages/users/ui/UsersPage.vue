<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { DeleteUserDialog } from '@/features/delete-user'
import { PAGE_SIZE } from '@/shared/config'
import { AppButton, AppCard, AppMessage, AppPagination, SearchBar } from '@/shared/ui'
import { UsersTable } from '@/widgets/users-table'

const route = useRoute()
const router = useRouter()

// стан і дії беремо зі store: state через storeToRefs, actions - напряму
const store = useUsersStore()
const { users, total, isLoading, error } = storeToRefs(store)
const { fetchUsers } = store

// поточна сторінка і пошуковий запит живуть в URL (?page=2&q=john), а не в локальному стані
const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value >= 1 ? value : 1
})
const search = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

function goToPage(value: number, replace = false): Promise<unknown> {
  const location = { query: { ...route.query, page: value > 1 ? String(value) : undefined } }
  return replace ? router.replace(location) : router.push(location)
}

function onSearch(value: string): void {
  void router.replace({ query: { q: value.trim() || undefined } })
}

async function load(): Promise<void> {
  await fetchUsers(page.value, search.value)
  // сторінка поза межами (наприклад, ?page=99) - повертаємося на останню існуючу
  if (!error.value && total.value > 0 && page.value > totalPages.value) {
    await goToPage(totalPages.value, true)
  }
}

watch([page, search], load, { immediate: true })

// видалення користувача (діалог і виклик store - у features/delete-user)
const userToDelete = ref<User | null>(null)
const isDeleteOpen = ref(false)

function askDelete(user: User): void {
  userToDelete.value = user
  isDeleteOpen.value = true
}

async function onDeleted(): Promise<void> {
  // якщо видалили останнього користувача на сторінці - переходимо на попередню
  if (users.value.length === 0 && page.value > 1) {
    await goToPage(page.value - 1, true)
  }
}
</script>

<template>
  <AppCard>
    <div class="users-page__header">
      <h1 class="users-page__title">Users</h1>
      <AppButton label="Add user" icon="pi pi-plus" :to="{ name: 'user-create' }" />
    </div>

    <SearchBar class="users-page__search" :model-value="search" @update:model-value="onSearch" />

    <AppMessage v-if="error">
      <span class="users-page__error">
        {{ error }}
        <AppButton label="Try again" size="small" severity="danger" outlined @click="load" />
      </span>
    </AppMessage>

    <template v-else>
      <UsersTable
        :users="users"
        :loading="isLoading"
        :index-offset="(page - 1) * PAGE_SIZE"
        @delete="askDelete"
      />
      <AppPagination
        :page="page"
        :total="total"
        :rows="PAGE_SIZE"
        @update:page="goToPage($event)"
      />
    </template>

    <DeleteUserDialog v-model="isDeleteOpen" :user="userToDelete" @deleted="onDeleted" />
  </AppCard>
</template>

<style scoped lang="scss">
.users-page {
  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  &__title {
    margin: 0;
    font-size: 1.5rem;
  }

  &__search {
    margin-bottom: 1rem;
  }

  &__error {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
  }
}
</style>
