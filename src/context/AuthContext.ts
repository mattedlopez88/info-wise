interface AuthState {
  userId: number | null
  email: string | null
  token: string | null
  isAuthenticated: boolean
}