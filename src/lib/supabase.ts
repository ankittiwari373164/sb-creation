import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  sku: string
  weight: string
  created_at: string
  updated_at: string
}

export type Order = {
  id: string
  user_id: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: any
  created_at: string
  updated_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
}

export type CartItem = {
  product: Product
  quantity: number
}

export type User = {
  id: string
  email: string
  full_name: string
  created_at: string
}