<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getFullName, useUsersStore } from '@/entities/user'
import { DeleteUserDialog } from '@/features/delete-user'
import { AppButton, AppCard, AppMessage, AppSpinner } from '@/shared/ui'

// props: true у маршруті - параметр :id приходить як пропс (завжди рядок)
const props = defineProps<{
  id: string
}>()

const store = useUsersStore()
const { currentUser, isLoading, error } = storeToRefs(store)
const { fetchUser } = store
const router = useRouter()

// компонент перевикористовується при переході /users/1 -> /users/2, тому стежимо за id
watch(
  () => props.id,
  (id) => fetchUser(Number(id)),
  { immediate: true },
)

const isDeleteOpen = ref(false)

async function onDeleted(): Promise<void> {
  await router.push({ name: 'users' })
}
</script>

<template>
  <AppSpinner v-if="isLoading" />

  <div v-else-if="error" class="user-details-page__stack">
    <AppMessage>{{ error }}</AppMessage>
    <AppButton label="Back to users" severity="secondary" :to="{ name: 'users' }" />
  </div>

  <div v-else-if="currentUser" class="user-details-page__stack">
    <AppCard>
      <div class="user-details-page__header">
        <img
          v-if="currentUser.image"
          class="user-details-page__avatar"
          :src="currentUser.image"
          :alt="getFullName(currentUser)"
          width="96"
          height="96"
        />
        <div class="user-details-page__heading">
          <h1 class="user-details-page__title">{{ getFullName(currentUser) }}</h1>
          <p class="user-details-page__username">@{{ currentUser.username }}</p>
        </div>
        <div class="user-details-page__actions">
          <AppButton label="Edit" outlined :to="{ name: 'user-edit', params: { id } }" />
          <AppButton label="Delete" severity="danger" outlined @click="isDeleteOpen = true" />
        </div>
      </div>

      <dl class="user-details-page__fields">
        <dt>Email</dt>
        <dd>{{ currentUser.email }}</dd>
        <dt>Phone number</dt>
        <dd>{{ currentUser.phone }}</dd>
        <dt>Age</dt>
        <dd>{{ currentUser.age }}</dd>
        <dt>Gender</dt>
        <dd class="user-details-page__capitalize">{{ currentUser.gender }}</dd>
        <template v-if="currentUser.birthDate">
          <dt>Date of birth</dt>
          <dd>{{ currentUser.birthDate }}</dd>
        </template>
        <template v-if="currentUser.company">
          <dt>Company</dt>
          <dd>{{ currentUser.company.name }}, {{ currentUser.company.title }}</dd>
        </template>
        <template v-if="currentUser.address">
          <dt>Address</dt>
          <dd>
            {{ currentUser.address.address }}, {{ currentUser.address.city }},
            {{ currentUser.address.country }}
          </dd>
        </template>
      </dl>

      <AppButton label="Back to users" severity="secondary" :to="{ name: 'users' }" />
    </AppCard>

    <!-- сюди підставляється вкладений маршрут /users/:id/edit -->
    <RouterView />

    <DeleteUserDialog v-model="isDeleteOpen" :user="currentUser" @deleted="onDeleted" />
  </div>
</template>

<style scoped lang="scss">
.user-details-page {
  &__stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 1rem;
  }

  &__avatar {
    border-radius: 50%;
    background-color: var(--p-surface-200);
  }

  &__heading {
    flex-grow: 1;
  }

  &__title {
    margin: 0;
    font-size: 1.5rem;
  }

  &__username {
    margin: 0;
    color: var(--p-text-muted-color);
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
  }

  &__fields {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.5rem 1.5rem;
    margin: 1rem 0;

    dt {
      font-weight: 600;
    }

    dd {
      margin: 0;
    }
  }

  &__capitalize {
    text-transform: capitalize;
  }
}
</style>
