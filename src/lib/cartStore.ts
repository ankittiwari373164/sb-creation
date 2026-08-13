import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product, CartItem } from './supabase'
import { cookieStorageAdapter } from './cookieStorage'

// A cart "line" is uniquely identified by product + size + color + hand
// option, NOT just product id — otherwise adding the same product in two
// different sizes/colors would silently merge into one row and the second
// selection would be lost. This key is used everywhere items are matched,
// updated, or removed.
function variantKey(product: any): string {
  return [
    product?.id,
    product?.selectedSize || '',
    product?.selectedColor || '',
    product?.selectedHand || '',
  ].join('::')
}

interface CartStore {
  items: CartItem[]
  coupon: any | null
  _hasHydrated: boolean          // ← true once the cart cookie has been read
  setHasHydrated: (v: boolean) => void
  addItem: (product: Product, quantity?: number) => void
  removeItem: (product: Product) => void
  updateQuantity: (product: Product, quantity: number) => void
  setCoupon: (coupon: any) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      _hasHydrated: false,

      setHasHydrated: (v) => set({ _hasHydrated: v }),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const key = variantKey(product)
          const existingItem = state.items.find(
            (item) => variantKey(item.product) === key
          )
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                variantKey(item.product) === key
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          return { items: [...state.items, { product, quantity }] }
        })
      },

      removeItem: (product) => {
        const key = variantKey(product)
        set((state) => ({
          items: state.items.filter((item) => variantKey(item.product) !== key),
        }))
      },

      updateQuantity: (product, quantity) => {
        if (quantity <= 0) { get().removeItem(product); return }
        const key = variantKey(product)
        set((state) => ({
          items: state.items.map((item) =>
            variantKey(item.product) === key ? { ...item, quantity } : item
          ),
        }))
      },

      setCoupon: (coupon) => set({ coupon }),

      clearCart: () => set({ items: [], coupon: null }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
    }),
    {
      name: 'cart-storage',
      // Cart is persisted to a cookie instead of localStorage.
      storage: createJSONStorage(() => cookieStorageAdapter),
      // Called the instant rehydration from the cookie finishes
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)