import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { MAX_WINNERS } from '../constants'
import type { Participant } from '../types/participant'

export function useWinners(participants: Ref<Participant[]>) {
  const winnerIds = ref<string[]>([])

  // переможці виводяться з актуального списку учасників, тому редагування імені одразу видно і в блоці переможців
  const winners = computed(() =>
    winnerIds.value
      .map((id) => participants.value.find((participant) => participant.id === id))
      .filter((participant): participant is Participant => participant !== undefined),
  )

  // кандидати - лише ті, хто ще не став переможцем
  const candidates = computed(() =>
    participants.value.filter((participant) => !winnerIds.value.includes(participant.id)),
  )

  const canPickWinner = computed(
    () => winners.value.length < MAX_WINNERS && candidates.value.length > 0,
  )

  function pickWinner(): void {
    if (!canPickWinner.value) {
      return
    }
    const winner = candidates.value[Math.floor(Math.random() * candidates.value.length)]
    winnerIds.value.push(winner.id)
  }

  function removeWinner(id: string): void {
    winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
  }

  // якщо учасника видалили зі списку - він зникає і з блоку переможців
  watch(
    participants,
    (list) => {
      winnerIds.value = winnerIds.value.filter((id) =>
        list.some((participant) => participant.id === id),
      )
    },
    { deep: true },
  )

  return { winners, canPickWinner, pickWinner, removeWinner }
}
