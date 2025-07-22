export default function ProductCard({ product }) {
  return (
    <div className="w-[300px] h-[460px] bg-white shadow-md rounded-xl p-4 m-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      
      {/* Product Image */}
      <div className="w-full h-[180px] overflow-hidden rounded-md">
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="mt-3">
        <h2 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h2>
        <p className="text-sm text-gray-500 mt-1 h-[40px] overflow-hidden text-ellipsis">
          {product.description}
        </p>
      </div>

      {/* Price & Availability */}
      <div className="mt-2">
        {product.labelledPrice > product.price && (
          <span className="text-sm line-through text-gray-400 mr-2">
            Rs. {product.labelledPrice}
          </span>
        )}
        <span className="text-xl font-bold text-green-600">
          Rs. {product.price}
        </span>
        <p className={`mt-1 text-sm font-medium ${product.stock > 0 ? 'text-blue-600' : 'text-red-500'}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
      </div>

      {/* Button */}
      <div className="mt-4">
        <button
          className={`w-full py-2 text-white font-semibold rounded-md ${
            product.stock > 0
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? "Buy Now" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}
