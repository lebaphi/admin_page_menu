export type Menu = {
  categoryIds: string[]
  createdDate: Date
  name: string
  uid: string
  author: string
  id: string
  description?: string
  isNew: boolean
}

export type Category = {
  id: string
  category: string
  order: number
}

export interface MenuList {
  user: string
  uid: string
  children: Menu[]
  id: string
  isNew: boolean
}

export interface CategoryItem {
  id: string
  categoryId: string
  item: string
  description: string
  price: string
  order: number
}

export interface ItemExtras {
  id: string
  extra: string
  price: string
  order: number
}

export interface Option {
  id: string
  option: string
  required: string
  order: number
}

export type User = {
  uid: string
  displayName: string
  email: string
  photoURL: string
  isAdmin: boolean
}

export interface AuthData {
  email: string
  password: string
}
