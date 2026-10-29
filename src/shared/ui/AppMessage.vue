<script setup lang="ts">
import Message from 'primevue/message'

withDefaults(
  defineProps<{
    severity?: 'error' | 'success' | 'info'
  }>(),
  { severity: 'error' },
)
</script>

<template>
  <Message :severity="severity" :closable="false">
    <slot />
  </Message>
</template>
