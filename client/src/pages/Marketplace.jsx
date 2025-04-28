import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBolt } from 'react-icons/fa';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load products', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    applyFilters(category, selectedPriceRange);
  };

  const handlePriceChange = (e) => {
    const priceRange = e.target.value;
    setSelectedPriceRange(priceRange);
    applyFilters(selectedCategory, priceRange);
  };

  const applyFilters = (category, priceRange) => {
    let filtered = [...products];

    if (category !== 'All') {
      filtered = filtered.filter(product => product.category === category);
    }

    if (priceRange !== 'All') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        }
        return product.price >= min; // For the "100,000+ LKR" case
      });
    }

    setFilteredProducts(filtered);
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = (e, productId) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log(`Added product ${productId} to cart`);
  };

  const handleBuyNow = (e, productId) => {
    e.stopPropagation();
    // Buy now logic here
    console.log(`Buying product ${productId}`);
    navigate(`/checkout?product=${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">Marketplace</h2>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-10">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="All">All Categories</option>
          <option value="Tools">Tools</option>
          <option value="Machinery">Machinery</option>
          <option value="Electronics">Electronics</option>
          <option value="Parts">Parts</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={selectedPriceRange}
          onChange={handlePriceChange}
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200"
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
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found matching your filters.</p>
          <button 
            onClick={() => {
              setSelectedCategory('All');
              setSelectedPriceRange('All');
              setFilteredProducts(products);
            }}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col"
            >
              <div 
                onClick={() => handleProductClick(product._id)} 
                className="cursor-pointer flex-grow"
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 sm:h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 sm:h-56 flex items-center justify-center bg-gray-200 text-gray-400">
                    No Image Available
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-bold text-gray-800 truncate">{product.name}</h3>
                  <div className="flex items-center">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-blue-600">
                    LKR {product.price.toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description || 'No description available'}
                  </p>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={(e) => handleAddToCart(e, product._id)}
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button
                    onClick={(e) => handleBuyNow(e, product._id)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
                  >
                    <FaBolt /> Buy Now
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