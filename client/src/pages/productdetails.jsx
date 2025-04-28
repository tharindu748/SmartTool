import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaArrowLeft, FaRupeeSign, FaTag, FaUser, FaInfoCircle } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Product not found or server error');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Implement cart functionality here
    console.log(`Added ${quantity} of ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    // Implement direct purchase functionality here
    console.log(`Buying ${quantity} of ${product.name}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/marketplace')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back to Marketplace
        </button>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-contain"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-200 text-gray-400 text-lg">
                  No Image Available
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center mt-2">
                  <FaUser className="text-gray-500 mr-2" />
                  <span className="text-gray-600">Sold by: {product.supplierId?.username || 'Unknown Supplier'}</span>
                </div>
              </div>

              <div className="flex items-center">
                <FaRupeeSign className="text-green-600 text-2xl mr-2" />
                <span className="text-3xl font-bold text-gray-900">
                  {product.price.toLocaleString('en-IN')} LKR
                </span>
              </div>

              <div className="flex items-center">
                <FaTag className="text-blue-500 mr-2" />
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-2">
                  <FaInfoCircle className="mr-2 text-gray-500" />
                  Description
                </h3>
                <p className="text-gray-600">
                  {product.description || 'No description provided for this product.'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-gray-700 font-medium">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-12 bg-white shadow-xl rounded-lg overflow-hidden p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Specifications</h3>
              <ul className="space-y-2">
                <li className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-600">Category</span>
                  <span className="text-gray-900">{product.category}</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-600">Seller</span>
                  <span className="text-gray-900">{product.supplierId?.username || 'Unknown'}</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-600">Availability</span>
                  <span className="text-green-600">In Stock</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Shipping Information</h3>
              <ul className="space-y-2">
                <li className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-gray-900">Colombo and Suburbs</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-600">Shipping Cost</span>
                  <span className="text-gray-900">Free Delivery</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-600">Estimated Delivery</span>
                  <span className="text-gray-900">3-5 business days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;