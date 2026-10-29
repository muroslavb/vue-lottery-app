<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from '@/features/user-form/ui/UserForm.vue'
import { useUsersStore } from '@/entities/user/model/users.store'
import type { CreateUserDto } from '@/entities/user/model/types'
import { getErrorMessage } from '@/shared/lib/errors'
import { toFormValues } from '@/entities/user/lib/users'

const props = defineProps<{
  id: string
}>()

const store = useUsersStore()
const router = useRouter()

const isSubmitting = ref(false)
const submitError = ref('')

function backToDetails(): Promise<unknown> {
  return router.push({ name: 'user-detail', params: { id: props.id } })
}

async function handleSubmit(data: CreateUserDto): Promise<void> {
  isSubmitting.value = true
  submitError.value = ''
  try {
    await store.updateUser(Number(props.id), data)
    await backToDetails()
  } catch (e) {
    submitError.value = getErrorMessage(e)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- користувача завантажує батьківський UserDetailView; тут беремо його зі стору -->
  <section v-if="store.currentUser" class="card app-card">
    <h2 class="app-card__title">Edit user</h2>
    <p class="text-body-secondary">Update the fields and save the changes.</p>
    <UserForm
      :key="store.currentUser.id"
      submit-label="Update user"
      show-cancel
      :initial-values="toFormValues(store.currentUser)"
      :is-submitting="isSubmitting"
      :server-error="submitError"
      @submit="handleSubmit"
      @cancel="backToDetails"
    />
  </section>
</template>
