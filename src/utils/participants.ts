import type { Participant, SortState } from '../types/participant'

/** Фільтрація за іменем (без урахування регістру). Порожній запит повертає всіх учасників. */
export function filterByName(participants: readonly Participant[], query: string): Participant[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return [...participants]
  }
  return participants.filter((participant) =>
    participant.name.toLowerCase().includes(normalizedQuery),
  )
}

/** Сортування працює над копією - вихідний масив учасників не змінюється. */
export function sortParticipants(
  participants: readonly Participant[],
  sort: SortState | null,
): Participant[] {
  const copy = [...participants]
  if (!sort) {
    return copy
  }
  const factor = sort.direction === 'asc' ? 1 : -1
  return copy.sort((a, b) => {
    const result =
      sort.key === 'name'
        ? a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        : a.birthDate.localeCompare(b.birthDate)
    return result * factor
  })
}

/** yyyy-mm-dd -> dd/mm/yyyy (як у макеті таблиці). */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}
