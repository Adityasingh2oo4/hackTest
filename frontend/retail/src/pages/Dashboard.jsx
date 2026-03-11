import React from 'react'
import ProductCard from '../components/ProductCard'
import HeroBanner from '../components/HeroBanner'
import '../components/HeroBanner.css'
import { getProducts } from '../api/api'

export default function Dashboard() {
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const hasFetched = React.useRef(false);


  React.useEffect(() => {

    if (hasFetched.current) return;

    hasFetched.current = true;
    getProducts()
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load products"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <HeroBanner />

      <div id="products-section" className="px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Menu</h2>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500 text-lg animate-pulse">Loading products…</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
        )}
      </div>
    </>
  )
}