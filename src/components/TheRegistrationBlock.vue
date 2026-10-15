<script setup lang="ts">
import type { ParticipantFormData } from '../types/participant'
import ParticipantForm from './ParticipantForm.vue'

defineProps<{
  isEmailTaken: (email: string) => boolean
}>()

const emit = defineEmits<{
  register: [data: ParticipantFormData]
}>()
</script>

<template>
  <section class="card app-card">
    <h2 class="app-card__title">Register form</h2>
    <p class="text-body-secondary">Please fill in all the fields.</p>
    <ParticipantForm
      submit-label="Save"
      clear-after-submit
      :is-email-taken="isEmailTaken"
      @submit="emit('register', $event)"
    />
  </section>
</template>
