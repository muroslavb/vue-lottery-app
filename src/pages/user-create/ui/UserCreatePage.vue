<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import type { CreateUserDto } from '@/entities/user'
import { UserForm } from '@/features/user-form'
import { getErrorMessage } from '@/shared/lib'
import { AppCard, useNotify } from '@/shared/ui'

const store = useUsersStore()
const { createUser } = store
const router = useRouter()
const notify = useNotify()

const isSubmitting = ref(false)
const submitError = ref('')

async function handleSubmit(data: CreateUserDto): Promise<void> {
  isSubmitting.value = true
  submitError.value = ''
  try {
    const user = await createUser(data)
    notify.success('User created', `${user.firstName} ${user.lastName}`)
    await router.push({ name: 'users' })
  } catch (e) {
    submitError.value = getErrorMessage(e)
    notify.error('Could not create user', submitError.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AppCard title="New user">
    <p class="user-create-page__hint">Please fill in all the fields.</p>
    <UserForm
      submit-label="Create user"
      show-cancel
      :is-submitting="isSubmitting"
      :server-error="submitError"
      @submit="handleSubmit"
      @cancel="router.push({ name: 'users' })"
    />
  </AppCard>
</template>

<style scoped lang="scss">
.user-create-page__hint {
  margin-top: 0;
  color: var(--p-text-muted-color);
}
</style>
