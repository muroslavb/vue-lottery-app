import { number, object, string } from 'yup'

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
] as const

// допускаємо формати телефонів DummyJSON, наприклад "+81 965-431-3024"
export const PHONE_REGEXP = /^\+?[\d\s\-()]{7,20}$/

export const userSchema = object({
  firstName: string().trim().required('First name is required'),
  lastName: string().trim().required('Last name is required'),
  email: string().trim().required('Email is required').email('Enter a valid email address'),
  username: string()
    .trim()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  age: number()
    .typeError('Age must be a number')
    .required('Age is required')
    .integer('Age must be an integer')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be at most 120'),
  gender: string()
    .oneOf(['male', 'female'] as const, 'Select gender')
    .required('Gender is required'),
  phone: string()
    .trim()
    .required('Phone is required')
    .matches(PHONE_REGEXP, 'Enter a valid phone number'),
})
