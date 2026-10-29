<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseAlert from '@/shared/ui/BaseAlert.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BasePagination from '@/shared/ui/BasePagination.vue'
import BaseSpinner from '@/shared/ui/BaseSpinner.vue'
import SearchBar from '@/shared/ui/SearchBar.vue'
import UserDeleteModal from '@/features/delete-user/ui/UserDeleteModal.vue'
import { PAGE_SIZE } from '@/shared/config/constants'
import { useUsersStore } from '@/entities/user/model/users.store'
import type { User } from '@/entities/user/model/types'
import { getErrorMessage } from '@/shared/lib/errors'
import { getFullName } from '@/entities/user/lib/users'

const route = useRoute()
const router = useRouter()
const store = useUsersStore()

// поточна сторінка і пошуковий запит живуть в URL (?page=2&q=john), а не в локальному стані
const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value >= 1 ? value : 1
})
const search = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const totalPages = computed(() => Math.max(1, Math.ceil(store.total / PAGE_SIZE)))

function goToPage(value: number, replace = false): Promise<unknown> {
  const location = { query: { ...route.query, page: value > 1 ? String(value) : undefined } }
  return replace ? router.replace(location) : router.push(location)
}

function onSearch(value: string): void {
  void router.replace({ query: { q: value.trim() || undefined } })
}

async function load(): Promise<void> {
  await store.fetchUsers(page.value, search.value)
  // сторінка поза межами (наприклад, ?page=99) - повертаємося на останню існуючу
  if (!store.error && store.total > 0 && page.value > totalPages.value) {
    await goToPage(totalPages.value, true)
  }
}

watch([page, search], load, { immediate: true })

// видалення користувача
const userToDelete = ref<User | null>(null)
const isDeleteOpen = ref(false)
const isDeleting = ref(false)
const deleteError = ref('')

function askDelete(user: User): void {
  userToDelete.value = user
  deleteError.value = ''
  isDeleteOpen.value = true
}

async function confirmDelete(): Promise<void> {
  if (!userToDelete.value) {
    return
  }
  isDeleting.value = true
  deleteError.value = ''
  try {
    await store.deleteUser(userToDelete.value.id)
    isDeleteOpen.value = false
    // якщо видалили останнього користувача на сторінці - переходимо на попередню
    if (store.users.length === 0 && page.value > 1) {
      await goToPage(page.value - 1, true)
    }
  } catch (e) {
    deleteError.value = getErrorMessage(e)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <section class="card app-card">
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <h1 class="app-card__title">Users</h1>
      <RouterLink class="btn btn-primary" :to="{ name: 'user-create' }">Add user</RouterLink>
    </div>

    <SearchBar class="mb-3" :model-value="search" @update:model-value="onSearch" />

    <BaseSpinner v-if="store.isLoading" />

    <BaseAlert v-else-if="store.error">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <span>{{ store.error }}</span>
        <BaseButton size="sm" variant="outline-danger" @click="load">Try again</BaseButton>
      </div>
    </BaseAlert>

    <template v-else>
      <div class="table-responsive">
        <table class="table align-middle mb-3">
          <thead>
            <tr>
              <th scope="col" class="text-body-tertiary">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone number</th>
              <th scope="col"><span class="visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in store.users" :key="user.id">
              <th scope="row" class="fw-normal text-primary">
                {{ (page - 1) * PAGE_SIZE + index + 1 }}
              </th>
              <td>
                <RouterLink :to="{ name: 'user-detail', params: { id: user.id } }">
                  {{ getFullName(user) }}
                </RouterLink>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td class="text-end text-nowrap">
                <RouterLink
                  class="btn btn-sm btn-outline-primary me-1"
                  :to="{ name: 'user-edit', params: { id: user.id } }"
                >
                  Edit
                </RouterLink>
                <BaseButton size="sm" variant="outline-danger" @click="askDelete(user)">
                  Delete
                </BaseButton>
              </td>
            </tr>
            <tr v-if="store.users.length === 0">
              <td colspan="5" class="text-center text-body-secondary">No users found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <BasePagination :page="page" :total-pages="totalPages" @update:page="goToPage($event)" />
    </template>

    <UserDeleteModal
      v-model="isDeleteOpen"
      :user="userToDelete"
      :is-deleting="isDeleting"
      :error="deleteError"
      @confirm="confirmDelete"
    />
  </section>
</template>
