import { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AddProduct = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    return new Promise((resolve, reject) => {
      if (!file) return reject("No file selected");

      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `products/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async () => {
    try {
      const imageUrl = await uploadImage(); // ✅ upload image before sending product data

      const productData = {
        ...formData,
        imageUrl,
      };

      await axios.post('http://localhost:3000/api/products/add', productData, {
        withCredentials: true,
      });

      alert('✅ Product added with image!');

      // ✅ Reset form
      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
      });
      setFile(null);
      setImageUrl('');
      setUploadProgress(0);

    } catch (err) {
      console.error('❌ Failed to add product:', err);
      alert('❌ Product add failed.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar role="supplier" />

      <div className="flex-1 flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
            Add New Product
          </h2>

          {/* Image Upload */}
          <label className="block text-gray-600 mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded mb-4"
          />

          {uploadProgress > 0 && (
            <div className="text-sm text-gray-500 mb-2">Uploading: {uploadProgress}%</div>
          )}

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-32 h-32 object-cover mb-4 rounded border"
            />
          )}

          {/* Product Info Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Industrial Drill"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="">-- Select Category --</option>
                <option value="Tools">Tools</option>
                <option value="Machinery">Machinery</option>
                <option value="Electronics">Electronics</option>
                <option value="Parts">Parts</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Price (LKR)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 2500"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Brief description about the product"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="text-right pt-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition duration-200"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
