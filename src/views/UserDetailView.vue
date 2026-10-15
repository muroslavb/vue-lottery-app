<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseAlert from '@/components/BaseAlert.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseSpinner from '@/components/BaseSpinner.vue'
import UserDeleteModal from '@/components/UserDeleteModal.vue'
import { useUsersStore } from '@/stores/users'
import { getErrorMessage } from '@/utils/errors'
import { getFullName } from '@/utils/users'

// props: true у маршруті - параметр :id приходить як пропс (завжди рядок)
const props = defineProps<{
  id: string
}>()

const store = useUsersStore()
const router = useRouter()

// компонент перевикористовується при переході /users/1 -> /users/2, тому стежимо за id
watch(
  () => props.id,
  (id) => store.fetchUser(Number(id)),
  { immediate: true },
)

const isDeleteOpen = ref(false)
const isDeleting = ref(false)
const deleteError = ref('')

async function confirmDelete(): Promise<void> {
  isDeleting.value = true
  deleteError.value = ''
  try {
    await store.deleteUser(Number(props.id))
    isDeleteOpen.value = false
    await router.push({ name: 'users' })
  } catch (e) {
    deleteError.value = getErrorMessage(e)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <BaseSpinner v-if="store.isLoading" />

  <template v-else-if="store.error">
    <BaseAlert>{{ store.error }}</BaseAlert>
    <RouterLink class="btn btn-secondary" :to="{ name: 'users' }">Back to users</RouterLink>
  </template>

  <template v-else-if="store.currentUser">
    <section class="card app-card">
      <div class="d-flex flex-wrap align-items-start gap-3">
        <img
          v-if="store.currentUser.image"
          class="user-avatar"
          :src="store.currentUser.image"
          :alt="getFullName(store.currentUser)"
          width="96"
          height="96"
        />
        <div class="flex-grow-1">
          <h1 class="app-card__title">{{ getFullName(store.currentUser) }}</h1>
          <p class="text-body-secondary mb-0">@{{ store.currentUser.username }}</p>
        </div>
        <div class="d-flex gap-2">
          <RouterLink class="btn btn-outline-primary" :to="{ name: 'user-edit', params: { id } }">
            Edit
          </RouterLink>
          <BaseButton variant="outline-danger" @click="isDeleteOpen = true">Delete</BaseButton>
        </div>
      </div>

      <dl class="row mt-3 mb-0">
        <dt class="col-sm-3">Email</dt>
        <dd class="col-sm-9">{{ store.currentUser.email }}</dd>
        <dt class="col-sm-3">Phone number</dt>
        <dd class="col-sm-9">{{ store.currentUser.phone }}</dd>
        <dt class="col-sm-3">Age</dt>
        <dd class="col-sm-9">{{ store.currentUser.age }}</dd>
        <dt class="col-sm-3">Gender</dt>
        <dd class="col-sm-9 text-capitalize">{{ store.currentUser.gender }}</dd>
        <template v-if="store.currentUser.birthDate">
          <dt class="col-sm-3">Date of birth</dt>
          <dd class="col-sm-9">{{ store.currentUser.birthDate }}</dd>
        </template>
        <template v-if="store.currentUser.company">
          <dt class="col-sm-3">Company</dt>
          <dd class="col-sm-9">
            {{ store.currentUser.company.name }}, {{ store.currentUser.company.title }}
          </dd>
        </template>
        <template v-if="store.currentUser.address">
          <dt class="col-sm-3">Address</dt>
          <dd class="col-sm-9">
            {{ store.currentUser.address.address }}, {{ store.currentUser.address.city }},
            {{ store.currentUser.address.country }}
          </dd>
        </template>
      </dl>

      <div class="mt-3">
        <RouterLink class="btn btn-secondary" :to="{ name: 'users' }">Back to users</RouterLink>
      </div>
    </section>

    <!-- сюди підставляється вкладений маршрут /users/:id/edit -->
    <RouterView />

    <UserDeleteModal
      v-model="isDeleteOpen"
      :user="store.currentUser"
      :is-deleting="isDeleting"
      :error="deleteError"
      @confirm="confirmDelete"
    />
  </template>
</template>

<style scoped lang="scss">
.user-avatar {
  border-radius: 50%;
  background-color: #eef1f4;
}
</style>
