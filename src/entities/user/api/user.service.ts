import { http } from '@/shared/api/http-client'
import type { CreateUserDto, UpdateUserDto, User } from '../model/types'
import type {
  Creatable,
  Deletable,
  Editable,
  Page,
  PageParams,
  Pageable,
  Readable,
} from '@/shared/api/interfaces'

interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export class UserService
  implements
    Readable<User>,
    Pageable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable
{
  async getPage({ limit = 10, skip = 0, q = '' }: PageParams = {}): Promise<Page<User>> {
    const query = q.trim()
    const params = new URLSearchParams({ limit: String(limit), skip: String(skip) })
    if (query) {
      params.set('q', query)
    }
    const path = query ? '/users/search' : '/users'
    const data = await http<UsersResponse>(`${path}?${params.toString()}`)
    return { items: data.users, total: data.total }
  }

  async getAll(params: PageParams = {}): Promise<User[]> {
    return (await this.getPage(params)).items
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`)
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', { method: 'POST', body: JSON.stringify(data) })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  }

  async delete(id: number): Promise<void> {
    await http<unknown>(`/users/${id}`, { method: 'DELETE' })
  }
}
