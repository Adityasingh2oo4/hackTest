import React from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../api/api'

export default function Dashboard() {
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    getProducts()
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load products"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg animate-pulse">Loading products…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
      {data.map((item) => (
        <ProductCard
          product={item}
          key={item.id}
          productImg={item.imageUrl || item.img}
          alt={item.name}
          productName={item.name}
          productDescription={item.description}
          productPrice={item.price}
        />
      ))}
      {data.length === 0 && (
        <p className="col-span-full text-center text-gray-400 py-20">No products found.</p>
      )}
    </div>
  )
}