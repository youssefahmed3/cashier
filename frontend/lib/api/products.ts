// Products API service for React Query demonstration

export interface Product {
  id: string
  name: string
  price: number
  barcode: string
  category: string
  taxRate: number
  image?: string
  stock?: number
}

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock products data
const mockProducts: Product[] = [
  {
    id: "PRD001",
    name: "Basmati Rice",
    price: 45.99,
    barcode: "1234567890123",
    category: "Rice",
    taxRate: 0.14,
    image: "/images/rice.jpg",
    stock: 50
  },
  {
    id: "PRD002",
    name: "Olive Oil",
    price: 89.99,
    barcode: "1234567890124",
    category: "Oils",
    taxRate: 0.14,
    image: "/images/olive-oil.jpg",
    stock: 30
  },
  {
    id: "PRD003",
    name: "White Sugar",
    price: 12.99,
    barcode: "1234567890125",
    category: "Sugar",
    taxRate: 0.14,
    image: "/images/sugar.jpg",
    stock: 100
  },
  {
    id: "PRD004",
    name: "Wheat Flour",
    price: 8.99,
    barcode: "1234567890126",
    category: "Flour",
    taxRate: 0.14,
    image: "/images/flour.jpg",
    stock: 75
  },
  {
    id: "PRD005",
    name: "Cooking Oil",
    price: 25.99,
    barcode: "1234567890127",
    category: "Oils",
    taxRate: 0.14,
    image: "/images/cooking-oil.jpg",
    stock: 40
  },
  {
    id: "PRD006",
    name: "Table Salt",
    price: 3.99,
    barcode: "1234567890128",
    category: "Spices",
    taxRate: 0.14,
    image: "/images/salt.jpg",
    stock: 200
  },
  {
    id: "PRD007",
    name: "Black Tea",
    price: 15.99,
    barcode: "1234567890129",
    category: "Beverages",
    taxRate: 0.14,
    image: "/images/tea.jpg",
    stock: 60
  },
  {
    id: "PRD008",
    name: "Turkish Coffee",
    price: 35.99,
    barcode: "1234567890130",
    category: "Beverages",
    taxRate: 0.14,
    image: "/images/coffee.jpg",
    stock: 25
  }
]

// API functions
export const getProducts = async (): Promise<Product[]> => {
  await delay(500) // Simulate network delay
  return mockProducts
}

export const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
  await delay(200)
  return mockProducts.find(product => product.barcode === barcode) || null
}

export const searchProducts = async (query: string): Promise<Product[]> => {
  await delay(300)
  const lowercaseQuery = query.toLowerCase()
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.barcode.includes(query) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  )
}

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  await delay(200)
  return mockProducts.filter(product => product.category === category)
}

// React Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  category: (category: string) => [...productKeys.all, 'category', category] as const,
} 