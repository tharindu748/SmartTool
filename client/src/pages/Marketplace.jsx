import { useEffect, useState } from 'react';
import axios from 'axios';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch(err => console.error('Failed to load products', err));
  }, []);

  const handleAddToCart = (product) => {
    setCart(prev => [...prev, product]);
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = (product) => {
    alert(`Buying now: ${product.name}`);
    // You can navigate to checkout page here
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    applyFilters(e.target.value, selectedPriceRange);
  };

  const handlePriceChange = (e) => {
    setSelectedPriceRange(e.target.value);
    applyFilters(selectedCategory, e.target.value);
  };

  const applyFilters = (category, priceRange) => {
    let filtered = [...products];

    // Filter by Category
    if (category !== 'All') {
      filtered = filtered.filter(product => product.category === category);
    }

    // Filter by Price Range
    if (priceRange !== 'All') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Marketplace</h2>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-6 justify-center mb-10">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded-md shadow-md focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="All">All Categories</option>
          <option value="Tools">Tools</option>
          <option value="Machinery">Machinery</option>
          <option value="Electronics">Electronics</option>
          <option value="Parts">Parts</option>
          <option value="Other">Other</option>
        </select>

        {/* Price Filter */}
        <select
          value={selectedPriceRange}
          onChange={handlePriceChange}
          className="p-2 border rounded-md shadow-md focus:outline-none focus:ring focus:ring-green-200"
        >
          <option value="All">All Prices</option>
          <option value="0-5000">0 - 5,000 LKR</option>
          <option value="5000-10000">5,000 - 10,000 LKR</option>
          <option value="10000-50000">10,000 - 50,000 LKR</option>
          <option value="50000-100000">50,000 - 100,000 LKR</option>
          <option value="100000-1000000">100,000+ LKR</option>
        </select>
      </div>

      {/* Products Section */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found matching filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              {/* Product Image */}
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-400">
                  No Image
                </div>
              )}

              {/* Product Info */}
              <div className="p-5 space-y-2">
                <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500">Category: {product.category}</p>
                <p className="text-lg font-semibold text-blue-600">LKR {product.price.toLocaleString()}</p>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="text-xs text-gray-400">
                  Supplier: {product.supplierId?.username || 'Unknown'}
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition"
                  >
                    🛒 Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
                  >
                    🛍 Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
