<script setup lang="ts">
import Button from 'primevue/button'
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    label?: string
    icon?: string
    type?: 'button' | 'submit' | 'reset'
    severity?: 'secondary' | 'danger' | 'contrast'
    outlined?: boolean
    text?: boolean
    size?: 'small' | 'large'
    loading?: boolean
    disabled?: boolean
    /** Якщо задано - кнопка рендериться як посилання vue-router. */
    to?: RouteLocationRaw
  }>(),
  {
    label: undefined,
    icon: undefined,
    type: 'button',
    severity: undefined,
    outlined: false,
    text: false,
    size: undefined,
    loading: false,
    disabled: false,
    to: undefined,
  },
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <RouterLink v-if="to" v-slot="{ href, navigate }" :to="to" custom>
    <Button
      as="a"
      :href="href"
      :label="label"
      :icon="icon"
      :severity="severity"
      :outlined="outlined"
      :text="text"
      :size="size"
      @click="navigate"
    />
  </RouterLink>
  <Button
    v-else
    :type="type"
    :label="label"
    :icon="icon"
    :severity="severity"
    :outlined="outlined"
    :text="text"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    @click="emit('click', $event)"
  />
</template>
