import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI, categoriesAPI } from '../services/api';
import Navbar from '../components/common/Navbar';

interface Product {
  _id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: Category; // Change this to Category object instead of string
  rating?: number;
  stock: number;
  createdAt: string;
  hue?: number;
  colors?: Array<{
    name: string;
    hex: string;
    stock: number;
  }>;
  sizes?: Array<{
    name: string;
    stock: number;
  }>;
  specifications?: any;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
}

const ProductsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    // Remove id field since MongoDB auto-generates it
    name: '',
    description: '',
    image: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    category: '',
    rating: 0,
    stock: 0,
    hue: 0,
    colors: [{ name: '', hex: '#000000', stock: 0 }],
    sizes: [{ name: '', stock: 0 }],
    specifications: {}
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        colors: formData.colors.filter(color => color.name && color.hex),
        sizes: formData.sizes.filter(size => size.name)
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct._id, productData);
      } else {
        await productsAPI.create(productData);
      }
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      // id: product._id, // This should now work correctly
      name: product.name,
      description: product.description,
      image: product.image || '',
      price: product.price,
      originalPrice: product.originalPrice || 0,
      discount: product.discount || 0,
      category: typeof product.category === 'object' ? product.category._id : product.category,
      rating: product.rating || 0,
      stock: product.stock,
      hue: product.hue || 0,
      colors: product.colors || [{ name: '', hex: '#000000', stock: 0 }],
      sizes: product.sizes || [{ name: '', stock: 0 }],
      specifications: product.specifications || {}
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      // Remove id field since MongoDB auto-generates it
      name: '',
      description: '',
      image: '',
      price: 0,
      originalPrice: 0,
      discount: 0,
      category: '',
      rating: 0,
      stock: 0,
      hue: 0,
      colors: [{ name: '', hex: '#000000', stock: 0 }],
      sizes: [{ name: '', stock: 0 }],
      specifications: {}
    });
  };

  const addColorField = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: '', hex: '#000000', stock: 0 }]
    });
  };

  const removeColorField = (index: number) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index)
    });
  };

  const addSizeField = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { name: '', stock: 0 }]
    });
  };

  const removeSizeField = (index: number) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Products</h2>
          <button
            onClick={() => {
              setEditingProduct(null);
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add New Product
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md p-6">
                {product.image && (
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
                )}
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="mb-2">
                  <span className="text-lg font-bold text-green-600">${product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                  )}
                  {product.discount && product.discount > 0 && (
                    <span className="text-sm text-red-500 ml-2">-{product.discount}%</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  <p>Category: {typeof product.category === 'object' ? product.category.name : product.category}</p>
                  <p>Stock: {product.stock}</p>
                  {product.rating && <p>Rating: {product.rating}/5</p>}
                </div>
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-2">
                    <span className="text-sm font-medium">Colors: </span>
                    <div className="flex gap-1 mt-1">
                      {product.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)} // Use product.id here
                    className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Remove Product ID field completely since it's auto-generated */}
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                {/* Price Fields */}
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                    step="0.01"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Original Price</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                    step="0.01"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                    min="0"
                    max="100"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    min="0"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                {/* Colors Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Colors</label>
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Color name"
                        value={color.name}
                        onChange={(e) => {
                          const newColors = [...formData.colors];
                          newColors[index].name = e.target.value;
                          setFormData({ ...formData, colors: newColors });
                        }}
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                      />
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => {
                          const newColors = [...formData.colors];
                          newColors[index].hex = e.target.value;
                          setFormData({ ...formData, colors: newColors });
                        }}
                        className="w-12 border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={color.stock}
                        onChange={(e) => {
                          const newColors = [...formData.colors];
                          newColors[index].stock = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, colors: newColors });
                        }}
                        className="w-20 border border-gray-300 rounded px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeColorField(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addColorField}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    + Add Color
                  </button>
                </div>

                {/* Sizes Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Sizes</label>
                  {formData.sizes.map((size, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Size name"
                        value={size.name}
                        onChange={(e) => {
                          const newSizes = [...formData.sizes];
                          newSizes[index].name = e.target.value;
                          setFormData({ ...formData, sizes: newSizes });
                        }}
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={size.stock}
                        onChange={(e) => {
                          const newSizes = [...formData.sizes];
                          newSizes[index].stock = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, sizes: newSizes });
                        }}
                        className="w-20 border border-gray-300 rounded px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeSizeField(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSizeField}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    + Add Size
                  </button>
                </div>

                <div className="md:col-span-2 flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};



export default ProductsPage;
