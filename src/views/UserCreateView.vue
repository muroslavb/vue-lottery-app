<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from '@/components/UserForm.vue'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto } from '@/types/user'
import { getErrorMessage } from '@/utils/errors'

const store = useUsersStore()
const router = useRouter()

const isSubmitting = ref(false)
const submitError = ref('')

async function handleSubmit(data: CreateUserDto): Promise<void> {
  isSubmitting.value = true
  submitError.value = ''
  try {
    await store.createUser(data)
    await router.push({ name: 'users' })
  } catch (e) {
    submitError.value = getErrorMessage(e)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="card app-card">
    <h1 class="app-card__title">New user</h1>
    <p class="text-body-secondary">Please fill in all the fields.</p>
    <UserForm
      submit-label="Create user"
      show-cancel
      :is-submitting="isSubmitting"
      :server-error="submitError"
      @submit="handleSubmit"
      @cancel="router.push({ name: 'users' })"
    />
  </section>
</template>
