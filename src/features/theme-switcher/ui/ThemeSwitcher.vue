<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AppButton } from '@/shared/ui'
import { useThemeStore } from '../model/theme.store'

const store = useThemeStore()
const { isDark } = storeToRefs(store)
const { toggle } = store
</script>

<template>
  <AppButton
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    text
    severity="secondary"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  />
</template>
