<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { AppButton, useNotify } from '@/shared/ui'

const session = useSessionStore()
const router = useRouter()
const notify = useNotify()

async function logout(): Promise<void> {
  session.logout()
  notify.info('You have been logged out')
  await router.push({ name: 'login' })
}
</script>

<template>
  <AppButton
    label="Logout"
    icon="pi pi-sign-out"
    size="small"
    severity="secondary"
    outlined
    @click="logout"
  />
</template>
