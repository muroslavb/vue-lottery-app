import { ref, watch } from 'vue'
import type { Participant, ParticipantFormData } from '../types/participant'
import { createId } from '../utils/id'
import { loadParticipants, saveParticipants } from '../utils/storage'

export function useParticipants() {
  // відновлення з localStorage при завантаженні застосунку
  const participants = ref<Participant[]>(loadParticipants())

  // збереження - watcher з опцією deep: реагує і на додавання, і на зміну полів учасника
  watch(participants, (value) => saveParticipants(value), { deep: true })

  function addParticipant(data: ParticipantFormData): void {
    participants.value.push({ id: createId(), ...data })
  }

  function updateParticipant(id: string, data: ParticipantFormData): void {
    const index = participants.value.findIndex((participant) => participant.id === id)
    if (index !== -1) {
      participants.value[index] = { id, ...data }
    }
  }

  function removeParticipant(id: string): void {
    participants.value = participants.value.filter((participant) => participant.id !== id)
  }

  /** Унікальність e-mail без урахування регістру; ignoreId дозволяє виключити учасника, якого редагуємо. */
  function isEmailTaken(email: string, ignoreId?: string): boolean {
    const normalizedEmail = email.trim().toLowerCase()
    return participants.value.some(
      (participant) =>
        participant.id !== ignoreId && participant.email.trim().toLowerCase() === normalizedEmail,
    )
  }

  return { participants, addParticipant, updateParticipant, removeParticipant, isEmailTaken }
}
