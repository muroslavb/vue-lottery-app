<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'danger' | 'success' | 'info'
  }>(),
  { variant: 'danger' },
)
</script>

<template>
  <div class="alert" :class="`alert-${variant}`" role="alert">
    <slot />
  </div>
</template>
