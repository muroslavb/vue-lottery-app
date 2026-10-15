export interface Participant {
  id: string
  name: string
  birthDate: string
  email: string
  phone: string
}

export type ParticipantFormData = Omit<Participant, 'id'>

export type SortKey = 'name' | 'birthDate'
export type SortDirection = 'asc' | 'desc'

export interface SortState {
  key: SortKey
  direction: SortDirection
}
