import { httpClient } from '@/services/api/client'

type LoginDto = {
  username: string
  password: string
}

type LoginResponse = {
  token: string
}

export const getTokenFromLocalStorage = () => {
  const token = localStorage.getItem('@auth:token')

  if (!token) {
    return
  }

  return JSON.parse(token) as string
}

export const saveTokenToLocalStorage = (token?: string) => {
  if (!token) {
    localStorage.removeItem('@auth:token')
  }

  localStorage.setItem('@auth:token', JSON.stringify(token))
}

export const setAuthToken = (token?: string) => {
  if (token) {
    httpClient.defaults.headers['Authorization'] = `Bearer ${token}`
    return
  }

  delete httpClient.defaults.headers['Authorization']
}

export const hasAuthToken = () => {
  return !!getTokenFromLocalStorage()
}

export const login = async (dto: LoginDto) => {
  const { data } = await httpClient.post<LoginResponse>('/auth/login', dto)

  return data
}
