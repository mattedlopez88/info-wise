// auth.ts
export interface JwtResponse {
  token: string
  userId: string
  email: string
  role: 'User' | string
}

export interface UserPreferences {
  userId: number
  categoryIds: number[]
}

export interface NewsCategory {
  newsCategoryId: number
  newsCategoryName: string
}

export interface NewsSummary {
  title: string
  content: string
  date: string
}

export interface CategoryDto {
  name: string
  newsSummaryDtos: NewsSummary[]
}

export interface MacroCategory {
  name: string
  categoryDtos: CategoryDto[]
}