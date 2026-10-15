<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from './components/BaseButton.vue'
import BaseModal from './components/BaseModal.vue'
import ParticipantForm from './components/ParticipantForm.vue'
import TheParticipantsBlock from './components/TheParticipantsBlock.vue'
import TheRegistrationBlock from './components/TheRegistrationBlock.vue'
import TheWinnersBlock from './components/TheWinnersBlock.vue'
import { useParticipants } from './composables/useParticipants'
import { useWinners } from './composables/useWinners'
import type { Participant, ParticipantFormData } from './types/participant'

const { participants, addParticipant, updateParticipant, removeParticipant, isEmailTaken } =
  useParticipants()
const { winners, canPickWinner, pickWinner, removeWinner } = useWinners(participants)

// Учасник зберігається окремо від прапорця "відкрито", щоб під час анімації закриття вміст модалки не зникав
const editedParticipant = ref<Participant | null>(null)
const isEditModalOpen = ref(false)
const deletedParticipant = ref<Participant | null>(null)
const isDeleteModalOpen = ref(false)

function openEditModal(participant: Participant): void {
  editedParticipant.value = participant
  isEditModalOpen.value = true
}

// при редагуванні власний e-mail учасника дублікатом не вважається
function isEmailTakenByOthers(email: string): boolean {
  return isEmailTaken(email, editedParticipant.value?.id)
}

function handleUpdate(data: ParticipantFormData): void {
  if (editedParticipant.value) {
    updateParticipant(editedParticipant.value.id, data)
  }
  isEditModalOpen.value = false
}

function openDeleteModal(participant: Participant): void {
  deletedParticipant.value = participant
  isDeleteModalOpen.value = true
}

function confirmDelete(): void {
  if (deletedParticipant.value) {
    removeParticipant(deletedParticipant.value.id)
  }
  isDeleteModalOpen.value = false
}
</script>

<template>
  <main class="container app-container">
    <TheWinnersBlock
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @pick-winner="pickWinner"
      @remove-winner="removeWinner"
    />
    <TheRegistrationBlock :is-email-taken="isEmailTaken" @register="addParticipant" />
    <TheParticipantsBlock
      :participants="participants"
      @edit="openEditModal"
      @remove="openDeleteModal"
    />

    <BaseModal v-model="isEditModalOpen" title="Редагувати дані">
      <ParticipantForm
        v-if="editedParticipant"
        :key="editedParticipant.id"
        submit-label="Оновити дані"
        :initial-values="editedParticipant"
        :is-email-taken="isEmailTakenByOthers"
        @submit="handleUpdate"
      />
    </BaseModal>

    <BaseModal v-model="isDeleteModalOpen" title="Видалити учасника">
      <p v-if="deletedParticipant" class="mb-0">
        Ви дійсно бажаєте видалити учасника "{{ deletedParticipant.name }}", "{{
          deletedParticipant.email
        }}"?
      </p>
      <template #footer>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
        <BaseButton variant="secondary" @click="isDeleteModalOpen = false">Ні</BaseButton>
      </template>
    </BaseModal>
  </main>
</template>
