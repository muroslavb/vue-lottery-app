<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toFormValues, useUsersStore } from '@/entities/user'
import type { CreateUserDto } from '@/entities/user'
import { UserForm } from '@/features/user-form'
import { getErrorMessage } from '@/shared/lib'
import { AppCard, useNotify } from '@/shared/ui'

const props = defineProps<{
  id: string
}>()

const store = useUsersStore()
const { currentUser } = storeToRefs(store)
const { updateUser } = store
const router = useRouter()
const notify = useNotify()

const isSubmitting = ref(false)
const submitError = ref('')

function backToDetails(): Promise<unknown> {
  return router.push({ name: 'user-detail', params: { id: props.id } })
}

async function handleSubmit(data: CreateUserDto): Promise<void> {
  isSubmitting.value = true
  submitError.value = ''
  try {
    await updateUser(Number(props.id), data)
    notify.success('User updated', `${data.firstName} ${data.lastName}`)
    await backToDetails()
  } catch (e) {
    submitError.value = getErrorMessage(e)
    notify.error('Could not update user', submitError.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- користувача завантажує батьківська UserDetailsPage; тут беремо його зі store -->
  <AppCard v-if="currentUser" title="Edit user">
    <p class="user-edit-page__hint">Update the fields and save the changes.</p>
    <UserForm
      :key="currentUser.id"
      submit-label="Update user"
      show-cancel
      :initial-values="toFormValues(currentUser)"
      :is-submitting="isSubmitting"
      :server-error="submitError"
      @submit="handleSubmit"
      @cancel="backToDetails"
    />
  </AppCard>
</template>

<style scoped lang="scss">
.user-edit-page__hint {
  margin-top: 0;
  color: var(--p-text-muted-color);
}
</style>
