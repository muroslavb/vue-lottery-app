export type Gender = 'male' | 'female'

export interface UserAddress {
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface UserCompany {
  name: string
  department: string
  title: string
}

/** Користувач DummyJSON. Обов'язкові лише поля, що є в усіх відповідях API. */
export interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  age: number
  gender: Gender
  image?: string
  password?: string
  birthDate?: string
  role?: string
  address?: UserAddress
  company?: UserCompany
}

/** Значення форми створення/редагування користувача. */
export interface CreateUserDto {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  age: number
  gender: Gender
  phone: string
}

export type UpdateUserDto = Partial<CreateUserDto>
