<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Participant, SortDirection, SortKey, SortState } from '../types/participant'
import { filterByName, formatDate, sortParticipants } from '../utils/participants'
import BaseButton from './BaseButton.vue'
import SearchBar from './SearchBar.vue'

const props = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  edit: [participant: Participant]
  remove: [participant: Participant]
}>()

const SORT_ICONS: Record<SortKey, Record<SortDirection, string>> = {
  name: { asc: 'bi-sort-alpha-down', desc: 'bi-sort-alpha-up' },
  birthDate: { asc: 'bi-sort-down', desc: 'bi-sort-up' },
}

const nameFilter = ref('')
const sortState = ref<SortState | null>(null)

// спочатку фільтрація, потім сортування; вихідний масив props.participants не змінюється
const visibleParticipants = computed(() =>
  sortParticipants(filterByName(props.participants, nameFilter.value), sortState.value),
)

const isNothingFound = computed(
  () => props.participants.length > 0 && visibleParticipants.value.length === 0,
)

function toggleSort(key: SortKey): void {
  const current = sortState.value
  if (current?.key === key) {
    sortState.value = { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
  } else {
    sortState.value = { key, direction: 'asc' }
  }
}

function isSortedBy(key: SortKey): boolean {
  return sortState.value?.key === key
}

function sortIconClass(key: SortKey): string[] {
  const direction = sortState.value?.key === key ? sortState.value.direction : 'asc'
  return [SORT_ICONS[key][direction], isSortedBy(key) ? 'text-primary' : 'text-body-tertiary']
}

function ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
  if (sortState.value?.key !== key) {
    return 'none'
  }
  return sortState.value.direction === 'asc' ? 'ascending' : 'descending'
}
</script>

<template>
  <section class="card app-card">
    <SearchBar v-model="nameFilter" class="mb-3" />    <div class="table-responsive">
      <table class="table align-middle mb-0">
        <thead>
          <tr>
            <th scope="col" class="text-body-tertiary">#</th>
            <th scope="col" :aria-sort="ariaSort('name')">
              Name
              <button
                type="button"
                class="sort-button"
                aria-label="Sort by name"
                @click="toggleSort('name')"
              >
                <i class="bi" :class="sortIconClass('name')" aria-hidden="true" />
              </button>
            </th>
            <th scope="col" :aria-sort="ariaSort('birthDate')">
              Date of Birth
              <button
                type="button"
                class="sort-button"
                aria-label="Sort by date of birth"
                @click="toggleSort('birthDate')"
              >
                <i class="bi" :class="sortIconClass('birthDate')" aria-hidden="true" />
              </button>
            </th>
            <th scope="col">Email</th>
            <th scope="col">Phone number</th>
            <th scope="col"><span class="visually-hidden">Edit</span></th>
            <th scope="col"><span class="visually-hidden">Delete</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(participant, index) in visibleParticipants" :key="participant.id">
            <th scope="row" class="fw-normal text-primary">{{ index + 1 }}</th>
            <td>{{ participant.name }}</td>
            <td>{{ formatDate(participant.birthDate) }}</td>
            <td>{{ participant.email }}</td>
            <td>{{ participant.phone }}</td>
            <td>
              <BaseButton size="sm" variant="outline-primary" @click="emit('edit', participant)">
                Редагувати дані
              </BaseButton>
            </td>
            <td>
              <BaseButton size="sm" variant="outline-danger" @click="emit('remove', participant)">
                Видалити учасника
              </BaseButton>
            </td>
          </tr>
          <tr v-if="isNothingFound">
            <td colspan="7" class="text-center text-body-secondary">No participants found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped lang="scss">
.sort-button {
  padding: 0 0.25rem;
  border: 0;
  background: none;
  line-height: 1;
}
</style>
