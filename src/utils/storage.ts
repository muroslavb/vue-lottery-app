import { PARTICIPANTS_STORAGE_KEY } from '../constants'
import type { Participant } from '../types/participant'

function isParticipant(value: unknown): value is Participant {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.birthDate === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.phone === 'string'
  )
}

/** Відновлення учасників із localStorage. Пошкоджені дані не ламають застосунок. */
export function loadParticipants(): Participant[] {
  try {
    const raw = localStorage.getItem(PARTICIPANTS_STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isParticipant) : []
  } catch {
    return []
  }
}

export function saveParticipants(participants: readonly Participant[]): void {
  try {
    localStorage.setItem(PARTICIPANTS_STORAGE_KEY, JSON.stringify(participants))
  } catch {
    // localStorage може бути недоступним або переповненим - застосунок продовжує працювати в пам'яті
  }
}
